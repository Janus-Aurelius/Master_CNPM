import express from 'express';
import { AdminController } from '../controllers/AdminController';

const router = express.Router();
const adminController = new AdminController();

router.post('/create', adminController.createUser);

export default router;
