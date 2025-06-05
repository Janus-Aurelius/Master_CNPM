// src/index.ts
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { getCoursesHandler, addCourseHandler } from './src/controllers/courseController';
import authRoutes from "./src/routes/authRoutes";
import protectedRoutes from "./src/routes/protectedRoutes";
import {authenticateToken, authorizeRoles} from "./src/middleware/auth";
import academicRoutes from "./src/routes/academicRoutes";
import financialRoutes from "./src/routes/financialRoutes";
import adminRoutes from "./src/routes/adminRoutes";
import studentRoutes from "./src/routes/studentRoutes";
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './src/middleware/errorHandler';
import { validateCourse } from './src/middleware/validateCourse';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:3000', // hoặc domain FE của bạn
    credentials: true
}));
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100 // tối đa 100 request mỗi 15 phút
});
app.use(limiter);

// Public routes
app.use("/auth", authRoutes);
app.use("/auth/student", authenticateToken, authorizeRoles(['student']), studentRoutes);

// Protected routes
app.get("/api", (req, res) => {res.send("Welcome to the API.")});
app.use("/api/dashboard", protectedRoutes);
app.use("/api/academic", authenticateToken, authorizeRoles(['academic']), academicRoutes);
app.use("/api/financial", authenticateToken, authorizeRoles(['financial']), financialRoutes);
app.use("/api/admin", authenticateToken, authorizeRoles(['admin']), adminRoutes);

// Basic routes
app.get("/", (req, res) => {
    res.send("API is running. Try /courses to access courses.");
});
app.get("/courses", getCoursesHandler);
app.post("/courses", validateCourse, addCourseHandler);

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});