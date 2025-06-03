// src/routes/auth.routes.ts
import { Router, Request, Response, RequestHandler } from 'express';
import { login } from '../controllers/authController';
import { checkMaintenance } from '../middleware/maintenance'; // Thêm dòng này
const router = Router();



// POST /auth/login for logging in
router.post('/login', checkMaintenance, login as RequestHandler);

export default router;