import express from 'express';
import { getGlobalStats } from '../controllers/statsController.js';

const router = express.Router();

router.get('/', getGlobalStats);

export default router;
