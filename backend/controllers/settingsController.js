import asyncHandler from 'express-async-handler';
import UserSettings from '../models/userSettingsModel.js';
import RevisionSession from '../models/revisionSessionModel.js';

// Helper function to check if user has a *completed* today's revision
const hasCompletedTodaysRevision = async (userId) => {
     const todayStart = new Date();
     todayStart.setHours(0, 0, 0, 0);

     const todayEnd = new Date();
     todayEnd.setHours(23, 59, 59, 999);

     const session = await RevisionSession.findOne({
          user: userId,
          date: { $gte: todayStart, $lte: todayEnd }
     });

     if (!session || session.problems.length === 0) return false;

     // A session is only considered complete if every problem in it is marked as COMPLETED
     return session.problems.every(problem => problem.status === 'COMPLETED');
};


// @desc    Get user settings
const getUserSettings = asyncHandler(async (req, res) => {
     const settings = await UserSettings.findOne({ user: req.user._id });
     if (!settings) {
     const newSettings = await UserSettings.create({ user: req.user._id });
     return res.json(newSettings);
     }
     res.json(settings);
});

// @desc    Update user settings
const updateUserSettings = asyncHandler(async (req, res) => {
     const settings = await UserSettings.findOne({ user: req.user._id });

     if (!settings) {
          res.status(404);
          throw new Error('Settings not found. Cannot update.');
     }

     const {
          difficultyDistribution,
          revisionMode,
          customRevisionTopics,
          customRevisionCompanies
     } = req.body;

     const completedToday = await hasCompletedTodaysRevision(req.user._id);

     if (difficultyDistribution) {
          settings.difficultyDistribution = {
               easy: difficultyDistribution.easy ?? settings.difficultyDistribution.easy,
               medium: difficultyDistribution.medium ?? settings.difficultyDistribution.medium,
               hard: difficultyDistribution.hard ?? settings.difficultyDistribution.hard,
          };
          const { easy, medium, hard } = settings.difficultyDistribution;
          settings.problemsPerRevision = easy + medium + hard;
     }

     if (revisionMode !== undefined) {
          settings.revisionMode = revisionMode;
     if (revisionMode === 'RANDOM') {
          settings.customRevisionTopics = [];
          settings.customRevisionCompanies = [];
     } else if (revisionMode === 'TOPIC') {
          settings.customRevisionCompanies = [];
     } else if (revisionMode === 'COMPANY') {
          settings.customRevisionTopics = [];
     }
     }

     if (customRevisionTopics !== undefined) {
          settings.customRevisionTopics = customRevisionTopics;
     }
     
     if (customRevisionCompanies !== undefined) {
          settings.customRevisionCompanies = customRevisionCompanies;
     }

     const updatedSettings = await settings.save();
     
     if (completedToday) {
          res.json({ ...updatedSettings.toObject(), message: 'Settings updated successfully! Changes will apply from your next revision session.' });
     } else {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          await RevisionSession.deleteMany({ user: req.user._id, date: { $gte: todayStart } });
          res.json({ ...updatedSettings.toObject(), message: 'Settings updated successfully! Your new revision session is ready.' });
     }
});

export { getUserSettings, updateUserSettings };
