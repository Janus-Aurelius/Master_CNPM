import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Controllers
import { getCoursesHandler, addCourseHandler } from './src/controllers/courseController';

// Routes
import authRoutes from "./src/routes/auth.routes";
import protectedRoutes from "./src/routes/protected.routes";
import academicRoutes from "./src/routes/academic.routes";
import financialRoutes from "./src/routes/financial.routes";
import adminRoutes from "./src/routes/admin.routes";
import studentRoutes from "./src/routes/student.routes";

// Middleware
import { authenticateToken, authorizeRoles } from "./src/middleware/auth";
import { errorHandler } from './src/middleware/errorHandler';
import { validateCourse } from './src/middleware/validateCourse';

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Basic Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Public Routes
app.use("/api/auth", authRoutes);
app.get("/api", (req, res) => {res.send("Welcome to the API.")});

// Protected Routes
app.use("/api/dashboard", protectedRoutes);
app.use("/api/academic", authenticateToken, authorizeRoles(['academic']), academicRoutes);
app.use("/api/financial", authenticateToken, authorizeRoles(['financial']), financialRoutes);
app.use("/api/admin", authenticateToken, authorizeRoles(['admin']), adminRoutes);
app.use("/api/student", authenticateToken, authorizeRoles(['student']), studentRoutes);

// Course Routes
app.get("/api/courses", getCoursesHandler);
app.post("/api/courses", authenticateToken, validateCourse, addCourseHandler);

// Root Route
app.get("/", (req, res) => {
    res.send("API is running. Try /api/courses to access courses.");
});

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
