import asyncHandler from 'express-async-handler';
import Problem from '../models/problemModel.js';
import RevisionSession from '../models/revisionSessionModel.js';

// @desc    Get aggregated stats for the logged-in user
// @route   GET /api/stats
// @access  Private
const getUserStats = asyncHandler(async (req, res) => {
     const userId = req.user._id;

     const stats = await Problem.aggregate([
     {
          $match: { user: userId }
     },
     {
          $group: {
          _id: null,
          totalProblems: { $sum: 1 },
          mastered: {
               $sum: { $cond: [{ $eq: ['$status', 'Mastered'] }, 1, 0] }
          },
          revisiting: {
               $sum: { $cond: [{ $eq: ['$status', 'Revisiting'] }, 1, 0] }
          },
          pending: {
               $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          easy: {
               $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] }
          },
          medium: {
               $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] }
          },
          hard: {
               $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] }
          },
          archived: {
               $sum: { $cond: ['$isArchived', 1, 0] }
          }
          }
     },
     {
          $project: {
               _id: 0,
               totalProblems: 1,
               byStatus: {
                    mastered: '$mastered',
                    revisiting: '$revisiting',
                    pending: '$pending'
               },
               byDifficulty: {
                    easy: '$easy',
                    medium: '$medium',
                    hard: '$hard'
               },
               archived: 1
          }
     }
     ]);

     if (stats.length === 0) {
     return res.json({
          totalProblems: 0,
          byStatus: { mastered: 0, revisiting: 0, pending: 0 },
          byDifficulty: { easy: 0, medium: 0, hard: 0 },
          archived: 0
     });
     }

     res.json(stats[0]);
});

// @desc    Get user's revision streak data
// @route   GET /api/stats/streak
// @access  Private
const getRevisionStreak = asyncHandler(async (req, res) => {
     const userId = req.user._id;

     // Fetch sessions for the last 60 days
     const sixtyDaysAgo = new Date();
     sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
     sixtyDaysAgo.setHours(0, 0, 0, 0);

     // Get all sessions
     const sessions = await RevisionSession.find({
     user: userId,
     date: { $gte: sixtyDaysAgo }
     }).sort({ date: 1 });

     // Local date handling: 'YYYY-MM-DD' in user's expected locale
     function toLocalDateStr(date) {
          return new Date(date).toLocaleDateString('en-CA'); // 'YYYY-MM-DD' in local time
     }

     // Prepare sets for completed and all sessions (local date strings)
     const completedDatesSet = new Set();
     const allSessionDatesSet = new Set();
     sessions.forEach(session => {
     const dateStr = toLocalDateStr(session.date);
     allSessionDatesSet.add(dateStr);
     if (session.problems && session.problems.length > 0 && session.problems.every(p => p.status === 'COMPLETED')) {
          completedDatesSet.add(dateStr);
     }
     });

     // Create sorted lists
     const completedDates = Array.from(completedDatesSet).sort();
     const allSessionDates = Array.from(allSessionDatesSet).sort();

     // Calculate streaks
     let currentStreak = 0;
     let longestStreak = 0;

     if (completedDates.length > 0) {
     // Use local today
     const today = new Date();
     const todayStr = toLocalDateStr(today);
     
    
          let d = new Date(todayStr);
          if (completedDatesSet.has(toLocalDateStr(d))) {
               while (completedDatesSet.has(toLocalDateStr(d))) {
                    currentStreak++;
                    d.setDate(d.getDate() - 1);
               }
          } else {
               d.setDate(d.getDate() - 1); // move to yesterday
               if (completedDatesSet.has(toLocalDateStr(d))) {
                    while (completedDatesSet.has(toLocalDateStr(d))) {
                         currentStreak++;
                         d.setDate(d.getDate() - 1);
                    }
               }
          }


     // Longest streak calculation
     let tempStreak = 1;
     for (let i = 1; i < completedDates.length; i++) {
          const prev = new Date(completedDates[i - 1]);
          const curr = new Date(completedDates[i]);
          const diff = (curr - prev) / (1000 * 60 * 60 * 24);
          if (diff === 1) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
          } else {
          tempStreak = 1;
          longestStreak = Math.max(longestStreak, tempStreak);
          }
     }
     longestStreak = Math.max(longestStreak, tempStreak);
     }
     
     // Calendar - last 30 days
     const thirtyDaysAgo = new Date();
     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
     thirtyDaysAgo.setHours(0, 0, 0, 0);
     const compareStr = toLocalDateStr(thirtyDaysAgo);
     const recentCompletedDates = completedDates.filter(dateStr => dateStr >= compareStr);
     const recentAllSessionDates = allSessionDates.filter(dateStr => dateStr >= compareStr);

     res.json({
          currentStreak,
          longestStreak,
          completedDates: recentCompletedDates,
          allSessionDates: recentAllSessionDates,
          totalSessions: sessions.length,
          totalRevisionDays: completedDates.length
     });
});
export { getUserStats, getRevisionStreak };