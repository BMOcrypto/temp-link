import { Router } from 'express';
import LinkController from '../controllers/linkController';
import AuthController from '../controllers/authController';

const router = Router();
const linkController = new LinkController();
const authController = new AuthController();

// Route to create a new shortened link (authenticated)
router.post('/shorten', authController.authenticate.bind(authController), linkController.createLink);

// Route to get the user's link dashboard (authenticated)
router.get('/dashboard', authController.authenticate.bind(authController), linkController.getUserLinks);

// Route to handle expired links
router.get('/expired', linkController.getExpiredLinks);

// Route to retrieve a specific link by its shortened URL (public)
router.get('/:shortenedUrl', linkController.getLink);

export default router;