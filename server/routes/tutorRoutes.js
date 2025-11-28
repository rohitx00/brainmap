import express from 'express';
import * as tutorController from '../controllers/tutorController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Session management
router.post('/session', tutorController.createSession);
router.get('/session/:sessionId', tutorController.getSessionHistory);
router.delete('/session/:sessionId', tutorController.deleteSession);
router.get('/sessions', tutorController.getUserSessions);

// Messaging
router.post('/message', tutorController.sendMessage);

// Rate limiting
router.get('/limit', tutorController.getRemainingMessages);

export default router;
