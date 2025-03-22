// src/index.ts
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { getCoursesHandler, addCourseHandler } from './src/controllers/courseController';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get("/", (req, res) => {
    res.send("API is running. Try /courses to access courses.");
});
app.get("/courses", getCoursesHandler);
app.post("/courses", addCourseHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});