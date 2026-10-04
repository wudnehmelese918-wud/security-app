import { Router } from 'express';
import { login, register, getMe } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Apply strict rate limiting on authentication attempts
router.post('/login', authRateLimiter, login);
router.post('/register', authRateLimiter, register);
router.get('/me', protect, getMe);

export default router;
