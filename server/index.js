import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"

import { connectDB,db } from "./dbConnection.js"

import authRoutes from "./routes/authRoutes.js"
import quizRoutes from "./routes/quizRoutes.js"
import ansRoutes from "./routes/ansRoutes.js"

dotenv.config();
const app = express();
const port = process.env.PORT

app.use(bodyParser.json())
app.use(cors())

connectDB();



const setupScript = `
-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    score INT DEFAULT 0,
    quizzes_attended INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS  quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_questions INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS  answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS  user_answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE
);`;

// app.get('/', async (req, res) => {
//   try {

//     await db.query(setupScript);
//     res.send('Database setup complete.');
//   } catch (err) {
//     console.error('Error executing setup script:', err);
//     res.status(500).send('Database setup failed.');
//   }
// });

// const updatequizcount = `UPDATE quizzes SET total_questions = 10, total_points = 100 WHERE title = 'Computer Networks Quiz';`
// const updatequizcount2 = `UPDATE quizzes SET total_questions = 10, total_points = 100 WHERE title = 'Data Structure Quiz';`
// app.get('/updatequizcount',async (req,res)=>{
//   try{
//     await db.query(updatequizcount)
//     await db.query(updatequizcount2);
//     res.send('Quiz count updated');
//   }
//   catch (err) {
//     console.error('Error executing setup script:', err);
//     res.status(500).send('Database setup failed.');
//   }

// })

app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/ans', ansRoutes);





app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})