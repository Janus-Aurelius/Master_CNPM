import 'dotenv/config';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

// Route imports
import authRoutes from './src/routes/auth.routes';
import courseRoutes from './src/routes/academic/course.routes';
import protectedRoutes from './src/routes/protected.routes';
import academicRoutes from './src/routes/academic/academic.routes';
import financialRoutes from './src/routes/financial/financial.routes';
import adminRoutes from './src/routes/admin/admin.routes';
import studentRoutes from './src/routes/student/student.routes';

// Middleware imports
import { authenticateToken, authorizeRoles } from './src/middleware/auth';
import { errorHandler } from './src/middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Basic Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Public Auth Routes
app.use('/auth', authRoutes);

// Course Routes (RESTful)
app.use('/api/courses', courseRoutes);

// Student Routes (protected)
app.use('/api/student', authenticateToken, authorizeRoles(['student']), studentRoutes);

// Protected Routes
app.use('/api/dashboard', protectedRoutes);
app.use('/api/academic', authenticateToken, authorizeRoles(['academic']), academicRoutes);
app.use('/api/financial', authenticateToken, authorizeRoles(['financial']), financialRoutes);
app.use('/api/admin', authenticateToken, authorizeRoles(['admin']), adminRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('API is running. Try /api/courses to access courses.');
});

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});