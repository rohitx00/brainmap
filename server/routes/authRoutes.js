import express from 'express';
import * as authController from '../controllers/authController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Profile Routes
router.get('/profile/:userId', authenticateToken, authController.getProfile);
router.put('/profile/:userId', authenticateToken, authController.updateProfile);
router.put('/profile/:userId/password', authenticateToken, authController.changePassword);

export default router;
