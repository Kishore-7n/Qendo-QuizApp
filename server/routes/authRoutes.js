import express from "express"
// import bcrypt from "bcrypt"
import bcrypt from 'bcryptjs';
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import { db } from "../dbConnection.js"

dotenv.config();
const router = express.Router();
const jwtSecretKey = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRegisterQuery = `INSERT INTO users (username, password, email) VALUES($1, $2, $3)`;
        await db.query(userRegisterQuery, [username, hashedPassword, email]);
        return res.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
        console.error("Error is: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userFindQuery = `SELECT * FROM users WHERE username = $1`;
        const results = await db.query(userFindQuery, [username]);
        if (results.length == 0) {
            return res.status(401).json({ message: "User Not Found" });
        }
        const user = results.rows[0];
        // console.log(user);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Password Not Match" });
        }
        const token = jwt.sign({ user: user.id }, jwtSecretKey, { expiresIn: '1h' });
        return res.status(200).json({ token, user, message: "Login Success" });
    } catch (error) {
        console.error("Error is: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


router.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const query = 'SELECT username, email, quizzes_attended, score FROM users WHERE id = $1';
        const { rows } = await db.query(query, [userId]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router