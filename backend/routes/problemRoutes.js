import express from 'express';
const router = express.Router();
import {
  getProblems,
  getProblemById,
  addProblem,
  canAddProblem,
  updateProblem,
  deleteProblem,
  deleteMultipleProblems,
  checkDuplicateProblem,
  checkProblemInTodaysRevisionByTitle,
} from '../controllers/problemController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
  .get(protect, getProblems)
  .post(protect, addProblem)
  .delete(protect, deleteMultipleProblems);

router.route('/:id')
  .get(protect, getProblemById)
  .put(protect, updateProblem)
  .delete(protect, deleteProblem);

router.route('/check-duplicate/:title')
  .get(protect, checkDuplicateProblem);

router.route('/can-add')
  .post(protect, canAddProblem);

router.route('/check-in-todays-revision/:title')
  .get(protect, checkProblemInTodaysRevisionByTitle);

export default router;