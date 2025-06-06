import { Router } from 'express';
import studentRoutes from './student/student.routes';

const router = Router();

// Student routes
router.use('/student', studentRoutes);

// Các route khác sẽ được thêm vào sau khi hoàn thiện
// router.use('/auth', authRoutes);
// router.use('/academic', academicRoutes);
// router.use('/financial', financialRoutes);
// router.use('/admin', adminRoutes);

export default router;
