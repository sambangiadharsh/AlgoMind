import express from 'express';
const router = express.Router();
import { getUserStats, getRevisionStreak } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

// This route is protected and requires a logged-in user
router.route('/').get(protect, getUserStats);
router.route('/streak').get(protect, getRevisionStreak);
export default router;
