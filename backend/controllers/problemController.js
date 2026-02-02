import asyncHandler from 'express-async-handler';
import RevisionSession from '../models/revisionSessionModel.js';
import Problem from '../models/problemModel.js';
import { checkAndRefreshSessionIfNeeded } from "./revisionController.js";

// Helper function to escape special regex characters
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// @desc    Get problems with filtering, sorting, and pagination
const getProblems = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort, search, ...filters } = req.query;

  // Always filter by user
  const queryObj = { user: req.user._id };
  Object.assign(queryObj, filters);

  // Search across multiple fields
  if (search) {
    const regex = new RegExp(escapeRegex(search), 'i');
    queryObj.$or = [
      { title: regex },
      { notes: regex },
      { tags: regex },
      { companyTags: regex },
    ];
  }

  let query = Problem.find(queryObj);

  // Sorting
  if (sort) {
    const sortBy = sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(Number(limit));

  let problems = await query;

  // Ensure consistency in DB if archived
  for (let p of problems) {
    if (p.isArchived && p.status !== 'Mastered') {
      p.status = 'Mastered';
      await p.save(); // persist change
    }
  }

  const totalProblems = await Problem.countDocuments(queryObj);

  res.json({
    results: problems.length,
    totalPages: Math.ceil(totalProblems / limit),
    currentPage: Number(page),
    problems,
  });
});

// @desc    Get a single problem by ID
const getProblemById = asyncHandler(async (req, res) => {
  const problem = await Problem.findById(req.params.id);
  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }
  if (problem.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to view this problem');
  }

  // Enforce Mastered in DB if archived
  if (problem.isArchived && problem.status !== 'Mastered') {
    problem.status = 'Mastered';
    await problem.save();
  }

  res.json(problem);
});

// Add this function to problemController.js
const canAddProblem = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const userId = req.user._id;
  
  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }
  
  // Check for duplicates
  const existingProblem = await Problem.findOne({
    user: userId,
    title: { $regex: new RegExp(`^${title}$`, 'i') },
    status: { $ne: 'Mastered' },
    isArchived: { $ne: true }
  });
  
  if (!existingProblem) {
    return res.json({ canAdd: true, message: 'No conflicts found' });
  }
  
  // Check if the duplicate is in today's revision
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const session = await RevisionSession.findOne({
    user: userId,
    date: { $gte: todayStart, $lte: todayEnd },
    'problems.problem': existingProblem._id
  });
  
  if (session) {
    return res.json({ 
      canAdd: false, 
      message: 'Problem with this name exists and is in today\'s revision',
      existingProblem,
      inRevision: true
    });
  }
  
  return res.json({ 
    canAdd: false, 
    message: 'Problem with this name already exists',
    existingProblem,
    inRevision: false
  });
});

// @desc    Delete a single problem
const deleteProblem = asyncHandler(async (req, res) => {
  const problemId = req.params.id;
  const userId = req.user._id;
  
  // Check if problem is in today's revision
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const session = await RevisionSession.findOne({
    user: userId,
    date: { $gte: todayStart, $lte: todayEnd },
    'problems.problem': problemId
  });

  const problem = await Problem.findById(problemId);
  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }
  if (problem.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this problem');
  }
  await problem.deleteOne();
  res.json({ id: req.params.id, message: 'Problem removed successfully' });
});

// @desc    Delete multiple problems
const deleteMultipleProblems = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const userId = req.user._id;

  // Check if any problems are in today's revision
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const session = await RevisionSession.findOne({
    user: userId,
    date: { $gte: todayStart, $lte: todayEnd },
    'problems.problem': { $in: ids }
  }).populate('problems.problem');
  
  if (session) {
    const problemsInRevision = session.problems
      .filter(p => ids.includes(p.problem._id.toString()))
      .map(p => p.problem.title);
    
    res.status(400);
    throw new Error(`Cannot delete problems that are scheduled for revision today: ${problemsInRevision.join(', ')}. Please try again tomorrow.`);
  }

  const result = await Problem.deleteMany({
    _id: { $in: ids },
    user: req.user._id,
  });

  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error('No matching problems found to delete.');
  }

  res.json({ message: `${result.deletedCount} problems removed successfully` });
});

// @desc    Check for duplicate problem
const checkDuplicateProblem = asyncHandler(async (req, res) => {
  const { title } = req.params;
  const userId = req.user._id;
  
  // Find case-insensitive match and exclude archived/mastered problems
  const existingProblem = await Problem.findOne({
    user: userId,
    title: { $regex: new RegExp(`^${title}$`, 'i') },
    status: { $ne: 'Mastered' }, // Only consider non-mastered problems
    isArchived: { $ne: true } // Exclude archived problems
  });
  
  // Return just the problem object if exists, or null if not
  res.json(existingProblem);
});

const checkProblemInTodaysRevisionByTitle = asyncHandler(async (req, res) => {
  const { title } = req.params;
  const userId = req.user._id;
  
  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }
  
  // First find if a problem with this title exists
  const existingProblem = await Problem.findOne({
    user: userId,
    title: { $regex: new RegExp(`^${title}$`, 'i') }
  });
  
  if (!existingProblem) {
    return res.json({ 
      inRevision: false,
      message: 'No problem with this title found' 
    });
  }
  
  // Check if this problem is in today's revision
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const session = await RevisionSession.findOne({
    user: userId,
    date: { $gte: todayStart, $lte: todayEnd },
    'problems.problem': existingProblem._id
  });
  
  if (session) {
    return res.json({ 
      inRevision: true,
      existingProblem,
      message: 'Problem with this title is in today\'s revision' 
    });
  }
  
  return res.json({ 
    inRevision: false,
    existingProblem,
    message: 'Problem with this title exists but is not in today\'s revision' 
  });
});

const addProblem = asyncHandler(async (req, res) => {
  console.log('addProblem called with data:', req.body);
  
  const { title, link, difficulty, tags, notes, status, companyTags, isArchived } = req.body;
  
  if (!title || !link || !difficulty) {
    console.log('Validation failed: missing title, link, or difficulty');
    res.status(400);
    throw new Error('Please provide title, link, and difficulty');
  }

  const userId = req.user._id;
  console.log('User ID:', userId);

  // First check if there's a mastered problem with the same name
  const masteredDuplicate = await Problem.findOne({
    user: userId,
    title: { $regex: new RegExp(`^${title}$`, 'i') },
    status: 'Mastered'
  });

  // If mastered duplicate exists, delete it automatically
  if (masteredDuplicate) {
    console.log('Found mastered duplicate, deleting:', masteredDuplicate._id);
    await Problem.findByIdAndDelete(masteredDuplicate._id);
  }

  // Check if there's still a non-mastered duplicate
  const existingProblem = await Problem.findOne({
    user: userId,
    title: { $regex: new RegExp(`^${title}$`, 'i') },
    status: { $ne: 'Mastered' },
    isArchived: { $ne: true }
  });

  // If non-mastered duplicate exists, return error
  if (existingProblem) {
    console.log('Non-mastered duplicate found:', existingProblem._id);
    res.status(400);
    throw new Error('A problem with this name already exists and is not mastered');
  }

  // Create the new problem
  const problem = new Problem({
    user: userId,
    title,
    link,
    difficulty,
    tags,
    notes,
    companyTags,
    isArchived: !!isArchived,
    status: isArchived ? 'Mastered' : status,
  });

  // If archived, also push revision far into future
  if (problem.isArchived) {
    problem.nextRevisionDate = new Date('9999-12-31');
  }

  const createdProblem = await problem.save();
  console.log('Problem saved successfully:', createdProblem._id);
  
  // Check if this problem should be added to today's session
  try {
    console.log('Checking if problem should be added to session');
    const sessionResponse = await checkAndRefreshSessionIfNeeded(req.user._id);
    
    if (sessionResponse && sessionResponse.session) {
      console.log('Problem added to session, returning session data');
      return res.status(201).json({
        problem: createdProblem,
        session: sessionResponse.session,
        message: 'Problem added and included in today\'s revision session'
      });
    }
    console.log('Problem not added to session');
  } catch (error) {
    console.error('Error checking session refresh:', error);
    // Continue with normal response if session check fails
  }
  
  // Default response if problem wasn't added to session
  console.log('Returning normal response');
  res.status(201).json(createdProblem);
});

// @desc    Update a problem (with session refresh check)
const updateProblem = asyncHandler(async (req, res) => {
  const problemId = req.params.id;
  const userId = req.user._id; // Make sure this line is present
  const updateData = req.body;
  
  // Check if problem is in today's revision
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const session = await RevisionSession.findOne({
    user: userId,
    date: { $gte: todayStart, $lte: todayEnd },
    'problems.problem': problemId
  });
  
  if (session) {
    res.status(400);
    throw new Error('Cannot update problem that is scheduled for revision today. Please try again tomorrow.');
  }

  const problem = await Problem.findById(problemId);
  if (!problem) {
    res.status(404);
    throw new Error('Problem not found');
  }
  if (problem.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this problem');
  }

  Object.assign(problem, updateData);

  // If archived, enforce Mastered in DB
  if (problem.isArchived) {
    problem.status = 'Mastered';
    problem.nextRevisionDate = new Date('9999-12-31');
  }

  const updatedProblem = await problem.save();
  
  // Check if this updated problem should be added to today's session
  try {
    const sessionResponse = await checkAndRefreshSessionIfNeeded(req.user._id);
    
    if (sessionResponse && sessionResponse.session) {
      // Problem was added to the session
      return res.json({
        problem: updatedProblem,
        session: sessionResponse.session,
        message: 'Problem updated and included in today\'s revision session'
      });
    }
  } catch (error) {
    console.error('Error checking session refresh:', error);
    // Continue with normal response if session check fails
  }
  
  // Default response if problem wasn't added to session
  res.json(updatedProblem);
});

export {
  getProblems,
  getProblemById,
  addProblem,
  updateProblem,
  deleteProblem,
  deleteMultipleProblems,
  checkDuplicateProblem,
  canAddProblem,
  checkProblemInTodaysRevisionByTitle,
};