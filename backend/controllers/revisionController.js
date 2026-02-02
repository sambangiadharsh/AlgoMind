import asyncHandler from 'express-async-handler';
import Problem from '../models/problemModel.js';
import UserSettings from '../models/userSettingsModel.js';
import RevisionSession from '../models/revisionSessionModel.js';

// --- Seedable Shuffle Function ---
const seededShuffle = (array, seed) => {
    let currentIndex = array.length, randomIndex;
    let seedValue = seed;

    const rng = () => {
        seedValue = (seedValue * 9301 + 49297) % 233280;
        return seedValue / 233280;
    };

    while (currentIndex !== 0) {
        randomIndex = Math.floor(rng() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
};

// Helper function to check if user has completed today's revision
const hasCompletedTodaysRevision = async (userId) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const completedSession = await RevisionSession.findOne({
        user: userId,
        date: { $gte: todayStart, $lte: todayEnd }
    });

    if (!completedSession) return false;

    return completedSession.problems.every(problem => problem.status === 'COMPLETED');
};
// @desc    Get today's revision list for the logged-in user
const getTodaysRevision = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const settings = await UserSettings.findOne({ user: userId });
    if (!settings) {
        res.status(404);
        throw new Error('User settings not found.');
    }

    const { revisionMode, customRevisionTopics, customRevisionCompanies } = settings;
    const now = new Date();

    // Define today start & end for calendar-day sessions
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Check if today's session already exists and is not completed
    let session = await RevisionSession.findOne({
        user: userId,
        date: { $gte: todayStart, $lte: todayEnd }
    }).populate('problems.problem');

    // If session exists and is not fully completed, return it
    if (session && !session.problems.every(p => p.status === 'COMPLETED')) {
        return res.json({
            sessionId: session._id,
            problems: session.problems,
            createdAt: session.createdAt,
            message: 'Active session found for today'
        });
    }

    // If session exists but is completed, check if we should create a new one
    // (only create new session if it's a new calendar day)
    if (session && session.problems.every(p => p.status === 'COMPLETED')) {
        return res.json({
            sessionId: session._id,
            problems: session.problems,
            createdAt: session.createdAt,
            message: 'Today\'s revision already completed'
        });
    }

    // Base query to get eligible problems (exclude mastered and archived)
    const baseQuery = {
        user: userId,
        nextRevisionDate: { $lte: now },
        isArchived: { $ne: true },
        status: { $ne: 'Mastered' }
    };

    const allEligibleProblems = await Problem.find(baseQuery);
    if (!allEligibleProblems.length) {
        return res.json({
            sessionId: null,
            problems: [],
            createdAt: now,
            message: 'No problems found matching your revision settings'
        });
    }

    // Status priority for sorting
    const statusPriority = { 'Pending': 1, 'Revisiting': 2, 'Mastered': 3 };

    // Sort by date -> status -> interval
    const prioritizedProblems = [...allEligibleProblems].sort((a, b) => {
        const dateCompare = new Date(a.createdAt) - new Date(b.createdAt);
        if (dateCompare !== 0) return dateCompare;
        const statusCompare = statusPriority[a.status] - statusPriority[b.status];
        if (statusCompare !== 0) return statusCompare;
        return (a.revisionInterval || 1) - (b.revisionInterval || 1);
    });

    // Apply revision mode filters
    let filteredProblems = prioritizedProblems;
    if (revisionMode === 'TOPIC' && customRevisionTopics?.length) {
        filteredProblems = filteredProblems.filter(problem =>
            problem.tags.some(tag => customRevisionTopics.includes(tag))
        );
    } else if (revisionMode === 'COMPANY' && customRevisionCompanies?.length) {
        filteredProblems = filteredProblems.filter(problem =>
            problem.companyTags.some(tag => customRevisionCompanies.includes(tag))
        );
    } else if (revisionMode === 'COMBO') {
        let comboQuery = { ...baseQuery };
        if (customRevisionTopics?.length) comboQuery.tags = { $in: customRevisionTopics };
        if (customRevisionCompanies?.length) comboQuery.companyTags = { $in: customRevisionCompanies };
        const comboProblems = await Problem.find(comboQuery);
        filteredProblems = comboProblems.sort((a, b) => {
            const dateCompare = new Date(a.createdAt) - new Date(b.createdAt);
            if (dateCompare !== 0) return dateCompare;
            const statusCompare = statusPriority[a.status] - statusPriority[b.status];
            if (statusCompare !== 0) return statusCompare;
            return (a.revisionInterval || 1) - (b.revisionInterval || 1);
        });
    }

    if (!filteredProblems.length) {
        return res.json({
            sessionId: null,
            problems: [],
            createdAt: now,
            message: 'No problems found matching your revision settings'
        });
    }

    // Shuffle based on current day for consistency
    const dateSeed = parseInt(now.toISOString().slice(0, 10).replace(/-/g, ''));
    const shuffledProblems = seededShuffle([...filteredProblems], dateSeed);

    // Prepare revision list based on difficulty distribution
    const { easy, medium, hard } = settings.difficultyDistribution;
    const neededProblems = { Easy: easy, Medium: medium, Hard: hard };
    const revisionList = [];

    const problemsByDifficulty = {
        Easy: shuffledProblems.filter(p => p.difficulty === 'Easy'),
        Medium: shuffledProblems.filter(p => p.difficulty === 'Medium'),
        Hard: shuffledProblems.filter(p => p.difficulty === 'Hard')
    };

    for (const difficulty of ['Easy', 'Medium', 'Hard']) {
        const available = problemsByDifficulty[difficulty];
        const needed = Math.min(neededProblems[difficulty], available.length);
        for (let i = 0; i < needed; i++) {
            if (available[i]) {
                revisionList.push(available[i]);
            }
        }
    }

    // Create new calendar-day session
    session = await RevisionSession.create({
        user: userId,
        date: todayStart, // Use start of day for consistent date tracking
        problems: revisionList.map(problem => ({
            problem: problem._id,
            status: 'PENDING',
            confidence: null
        }))
    });

    await session.populate('problems.problem');

    res.json({
        sessionId: session._id,
        problems: session.problems,
        createdAt: session.createdAt,
        totalEligible: filteredProblems.length,
        settings: {
            revisionMode,
            requested: { easy, medium, hard },
            actual: {
                easy: revisionList.filter(p => p.difficulty === 'Easy').length,
                medium: revisionList.filter(p => p.difficulty === 'Medium').length,
                hard: revisionList.filter(p => p.difficulty === 'Hard').length
            }
        },
        message: 'New session created for today'
    });
});

// @desc    Mark a problem as reviewed
const markProblemAsReviewed = asyncHandler(async (req, res) => {
    const { confidence, sessionId } = req.body;
    const problemId = req.params.id;
    const userId = req.user._id;

    const session = await RevisionSession.findOne({ _id: sessionId, user: userId })
        .populate('problems.problem');

    if (!session) {
        res.status(404);
        throw new Error('Revision session not found');
    }

    const problemIndex = session.problems.findIndex(
        p => p.problem._id.toString() === problemId
    );

    if (problemIndex === -1) {
        res.status(404);
        throw new Error('Problem not found in session');
    }

    session.problems[problemIndex].status = 'COMPLETED';
    session.problems[problemIndex].confidence = confidence;
    session.problems[problemIndex].reviewedAt = new Date();

    const problem = await Problem.findById(problemId);
    if (problem) {
        let newInterval = problem.revisionInterval || 1;

        switch (confidence) {
            case 'MASTERED':
                newInterval = Math.ceil(newInterval * 2.5);
                problem.status = 'Mastered';
                break;
            case 'LESS_CONFIDENT':
                newInterval = Math.ceil(newInterval * 1.5);
                problem.status = 'Revisiting';
                break;
            case 'FORGOT':
            default:
                newInterval = 1;
                problem.status = 'Revisiting';
        }

        problem.lastRevised = new Date();
        problem.revisionInterval = newInterval;
        
        // Set next revision date to 24 hours from now
        const nextRevision = new Date();
        nextRevision.setHours(nextRevision.getHours() + 24);
        problem.nextRevisionDate = nextRevision;
        
        await problem.save();
    }

    await session.save();

    res.json({
        updatedProblem: session.problems[problemIndex],
        message: `Problem marked as ${confidence.toLowerCase()}. Next revision in 24 hours.`
    });
});

// @desc    Check if problems are in today's revision session
const checkProblemsInTodaysRevision = asyncHandler(async (req, res) => {
  const { problemIds } = req.body;
  const userId = req.user._id;

  if (!problemIds || !Array.isArray(problemIds)) {
    res.status(400);
    throw new Error('Problem IDs array is required');
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const session = await RevisionSession.findOne({
    user: userId,
    date: todayStart
  });

  const problemsInRevision = [];
  
  if (session) {
    for (const problemId of problemIds) {
      const isInRevision = session.problems.some(p => 
        p.problem.toString() === problemId.toString()
      );
      
      if (isInRevision) {
        problemsInRevision.push(problemId);
      }
    }
  }

  res.json({
    problemsInRevision,
    message: problemsInRevision.length > 0 
      ? 'Some problems are in today\'s revision' 
      : 'No problems in today\'s revision'
  });
});

// In revisionController.js
const shouldRefreshCurrentSession = async (userId, settings) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Check if there's an active session for today
    const session = await RevisionSession.findOne({
        user: userId,
        date: { $gte: todayStart, $lte: todayEnd }
    }).populate('problems.problem');

    if (!session || session.problems.every(p => p.status === 'COMPLETED')) {
        return false;
    }

    // Count current problems by difficulty in the session
    const currentCounts = {
        Easy: session.problems.filter(p => p.problem.difficulty === 'Easy').length,
        Medium: session.problems.filter(p => p.problem.difficulty === 'Medium').length,
        Hard: session.problems.filter(p => p.problem.difficulty === 'Hard').length
    };

    const requestedCounts = settings.difficultyDistribution;
    
    // Check if we have fewer problems than requested in any category
    const needsMoreProblems = 
        currentCounts.Easy < requestedCounts.easy ||
        currentCounts.Medium < requestedCounts.medium ||
        currentCounts.Hard < requestedCounts.hard;

    if (!needsMoreProblems) {
        return false;
    }

    // Check if there are new eligible problems that match current settings
    const now = new Date();
    const baseQuery = {
        user: userId,
        nextRevisionDate: { $lte: now },
        isArchived: { $ne: true },
        status: { $ne: 'Mastered' }
    };

    // Apply revision mode filters
    let query = { ...baseQuery };
    const { revisionMode, customRevisionTopics, customRevisionCompanies } = settings;

    if (revisionMode === 'TOPIC' && customRevisionTopics?.length) {
        query.tags = { $in: customRevisionTopics };
    } else if (revisionMode === 'COMPANY' && customRevisionCompanies?.length) {
        query.companyTags = { $in: customRevisionCompanies };
    } else if (revisionMode === 'COMBO') {
        if (customRevisionTopics?.length) query.tags = { $in: customRevisionTopics };
        if (customRevisionCompanies?.length) query.companyTags = { $in: customRevisionCompanies };
    }

    const eligibleProblems = await Problem.find(query);
    
    // Check if any eligible problems are not in the current session
    const sessionProblemIds = session.problems.map(p => p.problem._id.toString());
    const newEligibleProblems = eligibleProblems.filter(
        p => !sessionProblemIds.includes(p._id.toString())
    );

    return newEligibleProblems.length > 0;
};

// Helper function to check and refresh session if needed
const checkAndRefreshSessionIfNeeded = async (userId) => {
  try {
    console.log('checkAndRefreshSessionIfNeeded called with userId:', userId);
    
    if (!userId) {
      console.error('No userId provided to checkAndRefreshSessionIfNeeded');
      return null;
    }
    
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get user settings
    const settings = await UserSettings.findOne({ user: userId });
    if (!settings) {
      console.log('No settings found for user:', userId);
      return null;
    }

    // Check if today's session exists and is not completed
    let session = await RevisionSession.findOne({
      user: userId,
      date: { $gte: todayStart, $lte: todayEnd }
    }).populate('problems.problem');

    // If no session exists or session is completed, no need to refresh
    if (!session) {
      console.log('No session found for today');
      return null;
    }
    
    if (session.problems.every(p => p.status === 'COMPLETED')) {
      console.log('Session already completed');
      return null;
    }

    // Calculate requested problem count from settings
    const { easy, medium, hard } = settings.difficultyDistribution;
    const requestedCount = easy + medium + hard;
    
    // Count current problems by difficulty in the session
    const currentCounts = {
      Easy: session.problems.filter(p => p.problem.difficulty === 'Easy').length,
      Medium: session.problems.filter(p => p.problem.difficulty === 'Medium').length,
      Hard: session.problems.filter(p => p.problem.difficulty === 'Hard').length
    };

    // Check if we have fewer problems than requested in any category
    const needsMoreProblems = 
      currentCounts.Easy < easy ||
      currentCounts.Medium < medium ||
      currentCounts.Hard < hard;

    if (!needsMoreProblems) {
      console.log('No need for more problems in session');
      return null;
    }

    // Find eligible problems that match current settings but aren't in the session
    const now = new Date();
    const baseQuery = {
      user: userId,
      nextRevisionDate: { $lte: now },
      isArchived: { $ne: true },
      status: { $ne: 'Mastered' },
      _id: { $nin: session.problems.map(p => p.problem._id) }
    };

    // Apply revision mode filters
    let query = { ...baseQuery };
    const { revisionMode, customRevisionTopics, customRevisionCompanies } = settings;

    if (revisionMode === 'TOPIC' && customRevisionTopics?.length) {
      query.tags = { $in: customRevisionTopics };
    } else if (revisionMode === 'COMPANY' && customRevisionCompanies?.length) {
      query.companyTags = { $in: customRevisionCompanies };
    } else if (revisionMode === 'COMBO') {
      if (customRevisionTopics?.length) query.tags = { $in: customRevisionTopics };
      if (customRevisionCompanies?.length) query.companyTags = { $in: customRevisionCompanies };
    }

    const eligibleProblems = await Problem.find(query);
    
    if (!eligibleProblems.length) {
      console.log('No eligible problems found');
      return null;
    }

    // Status priority for sorting
    const statusPriority = { 'Pending': 1, 'Revisiting': 2, 'Mastered': 3 };

    // Sort by date -> status -> interval
    const prioritizedProblems = [...eligibleProblems].sort((a, b) => {
      const dateCompare = new Date(a.createdAt) - new Date(b.createdAt);
      if (dateCompare !== 0) return dateCompare;
      const statusCompare = statusPriority[a.status] - statusPriority[b.status];
      if (statusCompare !== 0) return statusCompare;
      return (a.revisionInterval || 1) - (b.revisionInterval || 1);
    });

    // Add problems to fill the shortage
    const problemsToAdd = [];
    
    // Easy problems needed
    if (currentCounts.Easy < easy) {
      const easyNeeded = easy - currentCounts.Easy;
      const easyProblems = prioritizedProblems.filter(p => p.difficulty === 'Easy').slice(0, easyNeeded);
      problemsToAdd.push(...easyProblems);
    }
    
    // Medium problems needed
    if (currentCounts.Medium < medium) {
      const mediumNeeded = medium - currentCounts.Medium;
      const mediumProblems = prioritizedProblems.filter(p => p.difficulty === 'Medium').slice(0, mediumNeeded);
      problemsToAdd.push(...mediumProblems);
    }
    
    // Hard problems needed
    if (currentCounts.Hard < hard) {
      const hardNeeded = hard - currentCounts.Hard;
      const hardProblems = prioritizedProblems.filter(p => p.difficulty === 'Hard').slice(0, hardNeeded);
      problemsToAdd.push(...hardProblems);
    }

    if (!problemsToAdd.length) {
      console.log('No problems to add after filtering');
      return null;
    }

    // Add new problems to the session
    for (const problem of problemsToAdd) {
      session.problems.push({
        problem: problem._id,
        status: 'PENDING',
        confidence: null
      });
    }

    await session.save();
    await session.populate('problems.problem');

    console.log('Session refreshed with', problemsToAdd.length, 'new problems');
    return { session };
    
  } catch (error) {
    console.error('Error in checkAndRefreshSessionIfNeeded:', error);
    return null;
  }
};



export { getTodaysRevision, markProblemAsReviewed, hasCompletedTodaysRevision, checkProblemsInTodaysRevision, shouldRefreshCurrentSession, checkAndRefreshSessionIfNeeded};