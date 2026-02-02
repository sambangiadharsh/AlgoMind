import express from 'express';
const settingsRouter = express.Router();
import { getUserSettings, updateUserSettings } from '../controllers/settingsController.js';
import { protect as protectSettings } from '../middleware/authMiddleware.js';

settingsRouter.route('/').get(protectSettings, getUserSettings).put(protectSettings, updateUserSettings);

export default settingsRouter;

