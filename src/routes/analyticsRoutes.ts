import { Router } from 'express';
import AnalyticsController from '../controllers/analyticsController';

const router = Router();
const analyticsController = new AnalyticsController();

// Route to get analytics data for a specific link
router.get('/link/:id', analyticsController.getLinkAnalytics);

// Route to get overall analytics data for the user
router.get('/user/:userId', analyticsController.getUserAnalytics);

export default router;