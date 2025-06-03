import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import adminRoutes from './routes/admin.routes';
import studentRoutes from './routes/student.routes';
import authRoutes from './routes/auth.routes'; // <-- Thêm dòng này
import { errorHandler } from './middleware/errorHandler';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes); // <-- Thêm dòng này

// Error handling middleware 
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});