import { generateQuestions } from '../gemini.js';
import { gradeQuiz } from '../grader_interface.js';
import { calculateStats } from '../stats_interface.js';
import { getRecommendation as getRecommendationFromModule } from '../recommender_interface.js';
import { getDueReviews } from '../spaced_repetition_interface.js';
import { searchTopics } from '../matcher_interface.js';
import { manageQueue } from '../study_queue_interface.js';
import { generatePDF } from '../pdf_service.js';
import Attempt from '../models/Attempt.js';

export const generateQuiz = async (req, res) => {
    const { topic, difficulty } = req.body;
    try {
        const questions = await generateQuestions(topic, difficulty);
        res.json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
};

export const submitQuiz = async (req, res) => {
    const { userId, topic, difficulty, answers, questions, timeTaken } = req.body;
    try {
        // 1. Grade using JS module
        const gradingResult = await gradeQuiz(questions, answers, timeTaken);

        // 2. Save to Database
        const attempt = new Attempt({
            user_id: userId,
            topic,
            difficulty,
            score: gradingResult.score,
            total_questions: questions.length,
            time_taken: timeTaken
        });

        const result = await attempt.save();

        res.json({
            attemptId: result._id,
            score: gradingResult.score,
            efficiency: gradingResult.efficiency,
            summary: gradingResult.summary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to submit quiz' });
    }
};

export const getHistory = async (req, res) => {
    try {
        const rows = await Attempt.find({ user_id: req.params.userId }).sort({ timestamp: -1 });
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};

export const getStats = async (req, res) => {
    try {
        const rows = await Attempt.find({ user_id: req.params.userId }).select('score total_questions time_taken');
        const stats = await calculateStats(rows);
        res.json(stats);
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

export const getRecommendation = async (req, res) => {
    try {
        const rows = await Attempt.find({ user_id: req.params.userId }).sort({ timestamp: 1 }).select('topic score total_questions');
        const recommendation = await getRecommendationFromModule(rows);
        res.json(recommendation);
    } catch (error) {
        console.error("Error fetching recommendation:", error);
        res.status(500).json({ error: 'Failed to fetch recommendation' });
    }
};

export const getReviews = async (req, res) => {
    try {
        const rows = await Attempt.find({ user_id: req.params.userId }).sort({ timestamp: 1 }).select('topic score total_questions timestamp');
        const reviews = await getDueReviews(rows);
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};

export const searchHistory = async (req, res) => {
    const { query } = req.query;
    try {
        const rows = await Attempt.find({ user_id: req.params.userId }).sort({ timestamp: -1 });

        if (!query) {
            res.json(rows);
            return;
        }

        const topics = rows.map(r => r.topic);
        const matches = await searchTopics(query, topics);

        // Filter rows based on matches
        const matchedTopics = new Set(matches.map(m => m.item));
        const filteredRows = rows.filter(r => matchedTopics.has(r.topic));

        res.json(filteredRows);
    } catch (error) {
        console.error("Error searching history:", error);
        res.status(500).json({ error: 'Failed to search history' });
    }
};

export const updateStudyPlan = async (req, res) => {
    const { currentQueue, operation, topic } = req.body;
    try {
        const updatedQueue = await manageQueue(currentQueue, operation, topic);
        res.json(updatedQueue);
    } catch (error) {
        console.error("Error updating study plan:", error);
        res.status(500).json({ error: 'Failed to update study plan' });
    }
};

export const getReport = async (req, res) => {
    try {
        const attempt = await Attempt.findById(req.params.attemptId);
        if (!attempt) return res.status(404).send('Attempt not found');

        const stream = res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment;filename=report-${attempt._id}.pdf`,
        });

        generatePDF(attempt, (chunk) => stream.write(chunk), () => stream.end());
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF');
    }
};
