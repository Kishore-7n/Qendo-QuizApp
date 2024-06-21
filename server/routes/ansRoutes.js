import express from "express"
import { db } from "../dbConnection.js"

const router = express.Router()

//To create a new answer
router.post('/:questionId/answers', async (req, res) => {
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

//To get all answers for a question
router.get('/:questionId/answers', async (req, res) => {
    const { questionId } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM answers WHERE question_id = $1',
            [questionId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit an answer
router.post('/user_answers', async (req, res) => {
    const { userId, questionId, answerId, quizId } = req.body;
    const quizIdInt = parseInt(quizId);
    try {
        const result = await db.query(
            'INSERT INTO user_answers (user_id, question_id, answer_id, quiz_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, questionId, answerId, quizIdInt]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// GET endpoint to fetch user answers by questionId
router.get('/user_answers', async (req, res) => {
    const { questionId } = req.query;
    try {
        let query = 'SELECT * FROM user_answers';
        const queryParams = [];

        if (questionId) {
            query += ' WHERE question_id = $1';
            queryParams.push(questionId);
        }

        const result = await db.query(query, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// DELETE endpoint to delete a user answer by ID
router.delete('/user_answers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM user_answers WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount > 0) {
            res.json({ message: 'User answer deleted successfully' });
        } else {
            res.status(404).json({ error: 'User answer not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.put('/user_answers/:id', async (req, res) => {
    const { id } = req.params;
    const { answerId } = req.body;

    try {
        // Check if the user answer exists
        const existingAnswer = await getUserAnswerById(id);

        if (!existingAnswer) {
            return res.status(404).json({ error: 'User answer not found' });
        }

        // Update the answerId in the user answer
        const updatedAnswer = await updateUserAnswer(id, answerId);

        res.json(updatedAnswer); // Respond with the updated user answer
    } catch (error) {
        console.error('Error updating user answer:', error);
        res.status(500).json({ error: 'Failed to update user answer' });
    }
});

router.post('/delete_user_answers', async (req, res) => {
    const { userId, quizId } = req.body;
  
    try {
      // Delete user answers for the specified user and quiz
      const deleteQuery = 'DELETE FROM user_answers WHERE user_id = $1 AND quiz_id = $2';
      const deleteParams = [userId, quizId];
      await db.query(deleteQuery, deleteParams);
  
      res.json({ message: 'User answers deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete user answers' });
    }
  });


const getUserAnswerById = async (id) => {
    const query = 'SELECT * FROM user_answers WHERE id = $1';
    const values = [id];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0]; // Return the first result (or null if not found)
    } catch (error) {
        console.error('Error querying user answer by ID:', error);
        throw error;
    }
};

// Function to update user answer by ID
const updateUserAnswer = async (id, answerId) => {
    const query = 'UPDATE user_answers SET answer_id = $1 WHERE id = $2 RETURNING *';
    const values = [answerId, id];

    try {
        const { rows } = await pool.query(query, values);
        return rows[0]; // Return the updated user answer
    } catch (error) {
        console.error('Error updating user answer:', error);
        throw error;
    }
};

router.post('/evaluate', async (req, res) => {
    const { userId, quizId } = req.body;

    // Convert quizId to integer
    const quizIdInt = parseInt(quizId); // Assuming quizId is received as a string

    try {
        // Fetch all user answers for the given quiz
        const userAnswersQuery = await db.query(
            'SELECT * FROM user_answers WHERE user_id = $1 AND quiz_id = $2',
            [userId, quizIdInt]
        );
        const userAnswers = userAnswersQuery.rows;
        // Fetch all correct answers for the quiz
        const correctAnswersQuery = await db.query(
            `SELECT a.question_id, a.id AS answer_id
             FROM answers a
             JOIN questions q ON a.question_id = q.id
             WHERE a.is_correct = TRUE`
        );
        const correctAnswers = correctAnswersQuery.rows;

        // Calculate the score
        let score = 0;

        userAnswers.forEach(userAnswer => {
            const isCorrect = correctAnswers.find(answer =>
                answer.question_id === userAnswer.question_id &&
                answer.answer_id === userAnswer.answer_id
            );
            if (isCorrect) {
                score += 1; // Assuming each correct answer gives 1 point
            }
        });

        // Log the score for debugging purposes
        console.log(`User ${userId} scored ${score} points`);

        // Update the user's score and increment quizzes_attended
        const updateUserQuery = `
            UPDATE users
            SET score = score + $1,
                quizzes_attended = quizzes_attended + 1
            WHERE id = $2
            RETURNING *`;
        const updateUserValues = [score, userId];

        const updatedUser = await db.query(updateUserQuery, updateUserValues);

        // Return the score and updated user details as JSON response
        res.json({ score, updatedUser: updatedUser.rows[0] });
    } catch (error) {
        console.error('Error evaluating quiz:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/user_answers/view', async (req, res) => {
    try {
        const query = 'SELECT * FROM user_answers';
        const result = await db.query(query);

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


export default router
