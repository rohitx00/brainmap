import express from 'express';
import { getLeaderboard, getUserStats } from '../controllers/gamificationController.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/user/:userId', getUserStats);

export default router;
