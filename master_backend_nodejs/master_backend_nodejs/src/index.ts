import express, { RequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { getCoursesHandler, addCourseHandler } from './controllers/courseController';
import authRoutes from "./routes/auth.routes";
import protectedRoutes from "./routes/protected.routes";
import { authenticateToken, authorizeRoles } from "./middleware/auth";
import academicRoutes from "./routes/academic.routes";
import adminRoutes from "./routes/admin.routes";
import studentRoutes from "./routes/student.routes";
import financialRoutes from "./routes/financial.routes";
import { checkMaintenance } from './middleware/maintenance';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Apply maintenance check middleware
app.use(checkMaintenance as RequestHandler);

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
app.post("/courses", addCourseHandler);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something broke!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 