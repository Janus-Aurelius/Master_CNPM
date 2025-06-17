import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './src/routes/auth.routes';
import adminRoutes from './src/routes/admin/admin.routes';
import academicRoutes from './src/routes/academic/academic.routes';
import financialRoutes from './src/routes/financial/financial.routes';
import studentRoutes from './src/routes/student/student.routes';
import { setupSocketHandlers } from './src/socket/socketHandler';
import { errorHandler } from './src/middleware/errorHandler';
import { maintenanceMode } from './src/middleware/maintenance';
import { auditLogger } from './src/middleware/auditLogger'; // Đường dẫn đúng tới file của bạn
import { securityController } from './src/controllers/AdminController/systemController';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use(auditLogger);
// Routes
app.use('/api/auth', maintenanceMode, authRoutes);
app.use('/api/admin', maintenanceMode, adminRoutes);
app.use('/api/academic', maintenanceMode, academicRoutes);
app.use('/api/financial', maintenanceMode, financialRoutes);
app.use('/api/student', maintenanceMode, studentRoutes);

// Error handling
app.use(errorHandler);

// Socket.io setup
setupSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});