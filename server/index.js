import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

import connectDB from './db.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.send('BrainMap API is running');
});

// Routes
app.use('/auth', authRoutes);
app.use('/api', quizRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/stats', statsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
