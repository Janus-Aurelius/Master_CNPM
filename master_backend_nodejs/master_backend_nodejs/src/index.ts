import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', studentRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something broke!'
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 