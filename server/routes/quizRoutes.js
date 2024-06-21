import express from "express"
import { db } from "../dbConnection.js"

const router = express.Router()

// Create a new quiz
router.post('/add', async (req, res) => {
    const { title, description, totalQuestions, totalPoints } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO quizzes (title, description, total_questions, total_points) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, totalQuestions, totalPoints]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//To get list of quizzes
router.get('/view', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM quizzes');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get quiz by quizId
router.get('/quizzes/:quizId', async (req, res) => {
    const { quizId } = req.params;
    try {
        const query = 'SELECT * FROM quizzes WHERE id = $1';
        const values = [quizId];

        const result = await db.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching quiz:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//To create a new question
router.post('/:quizId/questions', async (req, res) => {
    const { quizId } = req.params;
    const { text } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO questions (quiz_id, text) VALUES ($1, $2) RETURNING *',
            [quizId, text]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//To get all questions for a quiz
router.get('/quizzes/:quizId/questions', async (req, res) => {
    const { quizId } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM questions WHERE quiz_id = $1',
            [quizId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Update a question
// Update a question
router.put('/questions/:questionId', async (req, res) => {
    const { questionId } = req.params;
    const { text } = req.body;

    try {
        // Check if the question exists
        const existingQuestion = await db.query('SELECT * FROM questions WHERE id = $1', [questionId]);

        if (existingQuestion.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Update the question in the database
        const updatedQuestion = await db.query(
            'UPDATE questions SET text = $1 WHERE id = $2 RETURNING *',
            [text, questionId]
        );

        // Return the updated question
        res.json(updatedQuestion.rows[0]);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/questions/:questionId', async (req, res) => {
    const { questionId } = req.params;
    try {
        // Fetch the question details
        const questionQuery = await db.query('SELECT * FROM questions WHERE id = $1', [questionId]);
        const question = questionQuery.rows[0];

        // Check if the question exists
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        // Fetch the answers for the question
        const answersQuery = await db.query('SELECT * FROM answers WHERE question_id = $1', [questionId]);
        const answers = answersQuery.rows;

        // Attach answers to the question object
        question.answers = answers;

        // Return the question with answers
        res.json(question);
    } catch (err) {
        console.error('Error fetching question details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create or update answers for a question
router.post('/questions/:questionId/answers', async (req, res) => {
    const { questionId } = req.params;
    const { text, is_correct } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3) RETURNING *',
            [questionId, text, is_correct]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Fetching Leaderboard
//Fetching Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        // Query to fetch leaderboard data
        const query = `
            SELECT 
                id,
                username,
                quizzes_attended,
                score,
                ROUND((score / NULLIF(quizzes_attended, 0))::numeric, 2) AS marks
            FROM users
            ORDER BY marks DESC
        `;

        // Execute query
        const result = await db.query(query);
        // console.log("Marks: ", score / quizzes_attended, 0);

        // Return leaderboard data
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router

