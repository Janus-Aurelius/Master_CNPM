// src/routes/auth.routes.ts
import { Router, Request, Response, RequestHandler } from 'express';
import { login } from '../controllers/authController';

const router = Router();



// POST /auth/login for logging in
router.post('/login', login as RequestHandler);

export default router; 