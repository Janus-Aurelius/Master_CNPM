// src/index.ts
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { getCoursesHandler, createCourseHandler } from './src/controllers/courseController';
import authRoutes from "./src/routes/auth.routes";
import protectedRoutes from "./src/routes/protected.routes";
import {authenticateToken, authorizeRoles} from "./src/middleware/auth";
import academicRoutes from "./src/routes/academic.routes";
import financialRoutes from "./src/routes/financial.routes";
import adminRoutes from "./src/routes/admin.routes";
import studentRoutes from "./src/routes/student.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
app.post("/courses", createCourseHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});