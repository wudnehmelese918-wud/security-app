import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../models/user.model';
import { config } from '../config/env';
import { AuthRequest } from '../middleware/auth.middleware';

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout after 5 consecutive failed attempts

const generateToken = (id: string, role: string): string =>
  jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  } as jwt.SignOptions);

/**
 * POST /api/auth/login
 * Authenticates user credentials with rate-limiting and brute-force lockout protection
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Both email and password are required',
    });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
    return;
  }

  // Check if account is locked
  if (user.isLocked()) {
    const minutesLeft = Math.ceil(
      ((user.lockUntil?.getTime() || 0) - Date.now()) / (60 * 1000)
    );
    res.status(423).json({
      success: false,
      message: `Account temporarily locked due to repeated failed attempts. Please retry in ${minutesLeft} minute(s).`,
      lockUntil: user.lockUntil,
    });
    return;
  }

  // Check if account is active
  if (!user.isActive) {
    res.status(403).json({
      success: false,
      message: 'Account has been deactivated. Please contact the security supervisor.',
    });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_DURATION_MS);
      user.loginAttempts = 0;
      await user.save();
      res.status(423).json({
        success: false,
        message: 'Account has been locked for 15 minutes due to too many failed login attempts.',
        lockUntil: user.lockUntil,
      });
      return;
    }
    await user.save();
    const remainingAttempts = MAX_ATTEMPTS - user.loginAttempts;
    res.status(401).json({
      success: false,
      message: `Invalid email or password. (${remainingAttempts} attempt(s) remaining before temporary lockout)`,
    });
    return;
  }

  // Reset login attempts on successful sign-in
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  const token = generateToken(user.id as string, user.role);
  res.json({
    success: true,
    message: 'Authentication successful',
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
};

/**
 * POST /api/auth/register
 * Public registration assigns role 'guest' strictly to prevent unauthorized privilege escalation.
 * If authenticated Admin creates an account, higher roles are permitted.
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    res.status(400).json({
      success: false,
      message: 'Full name, email, and password (minimum 6 characters) are required',
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const exists = await User.findOne({ email: cleanEmail });
  if (exists) {
    res.status(409).json({
      success: false,
      message: 'A user account with this email address already exists',
    });
    return;
  }

  // Prevent role injection: only verified Admins can grant 'admin' or 'assistant'
  let assignedRole: UserRole = 'guest';
  if (req.user && req.user.role === 'admin' && req.body.role) {
    const validRoles: UserRole[] = ['admin', 'assistant', 'guest'];
    if (validRoles.includes(req.body.role)) {
      assignedRole = req.body.role;
    }
  }

  const user = await User.create({
    fullName: String(fullName).trim(),
    email: cleanEmail,
    password,
    role: assignedRole,
    isActive: true,
  });

  const token = generateToken(user.id as string, user.role);
  res.status(201).json({
    success: true,
    message: `Account registered successfully as ${assignedRole}`,
    token,
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
};

/**
 * GET /api/auth/me
 * Returns current authenticated profile with role info
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id).select('-password');
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, user });
};
