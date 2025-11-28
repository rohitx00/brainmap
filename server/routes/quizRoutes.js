import express from 'express';
import * as quizController from '../controllers/quizController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', quizController.generateQuiz);
router.post('/submit', authenticateToken, quizController.submitQuiz);
router.get('/history/:userId', authenticateToken, quizController.getHistory);
router.get('/stats/:userId', authenticateToken, quizController.getStats);
router.get('/recommendation/:userId', authenticateToken, quizController.getRecommendation);
router.get('/reviews/:userId', authenticateToken, quizController.getReviews);
router.get('/search/:userId', authenticateToken, quizController.searchHistory);
router.post('/study-plan', authenticateToken, quizController.updateStudyPlan);
router.get('/report/:attemptId', quizController.getReport);

export default router;
