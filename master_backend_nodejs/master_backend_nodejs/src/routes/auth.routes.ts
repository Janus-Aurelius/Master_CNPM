// src/routes/auth.routes.ts
import { Router, Request, Response, RequestHandler } from 'express';
import { login } from '../controllers/authController';
<<<<<<< HEAD

const router = Router();

// POST /login for logging in
router.post('/login', login as RequestHandler);
=======
import { checkMaintenance } from '../middleware/maintenance'; // Thêm dòng này
const router = Router();



// POST /auth/login for logging in
router.post('/login', checkMaintenance, login as RequestHandler);
>>>>>>> origin/Trong

export default router;