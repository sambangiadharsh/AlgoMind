import express from 'express';
const router = express.Router();
import { 
    getTodaysRevision, 
    markProblemAsReviewed,
    checkProblemsInTodaysRevision
} from '../controllers/revisionController.js';
import { protect } from '../middleware/authMiddleware.js';

// Route to get the daily list
router.route('/today').get(protect, getTodaysRevision);

// Route to mark a problem as reviewed
router.route('/review/:id').post(protect, markProblemAsReviewed);

// Route to check if problems are in today's revision
router.route('/check-todays-problems').post(protect, checkProblemsInTodaysRevision);

export default router;