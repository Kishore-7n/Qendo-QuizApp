CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    total_questions INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0;
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    text TEXT NOT NULL
);

CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

CREATE TABLE user_answers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    answer_id INTEGER REFERENCES answers(id) ON DELETE CASCADE
);


SELECT * FROM users;

SELECT * FROM quizzes;

SELECT * FROM questions;

SELECT * FROM answers;

SELECT * FROM user_answers;


ALTER TABLE users
ADD COLUMN score INT DEFAULT 0,
ADD COLUMN quizzes_attended INT DEFAULT 0;

ALTER TABLE user_answers
ADD COLUMN quiz_id INTEGER;

ALTER TABLE user_answers
ADD CONSTRAINT fk_quiz
FOREIGN KEY (quiz_id)
REFERENCES quizzes(id)
ON DELETE CASCADE;