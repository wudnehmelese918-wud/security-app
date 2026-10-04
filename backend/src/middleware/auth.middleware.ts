import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User, UserRole } from '../models/user.model';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

/**
 * Verifies JWT token and checks active status of user
 */
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required. No valid Bearer token provided.',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      id: string;
      role: UserRole;
    };

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User account associated with this token does not exist.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Account has been deactivated. Please contact campus security administrator.',
      });
      return;
    }

    if (user.isLocked()) {
      res.status(423).json({
        success: false,
        error: 'Locked',
        message: 'Account is temporarily locked due to excessive failed attempts.',
        lockUntil: user.lockUntil,
      });
      return;
    }

    req.user = {
      id: user.id as string,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
    };

    next();
  } catch (err: unknown) {
    const isExpired = (err as Error).name === 'TokenExpiredError';
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: isExpired
        ? 'Session expired. Please log in again.'
        : 'Invalid or forged authentication token.',
    });
  }
};

/**
 * Strict Role-Based Access Control (RBAC) middleware
 * Enforces allowed roles for specific protected routes
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required before checking permissions.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Access denied. Role "${req.user.role}" does not have permission to perform this action. Required: [${roles.join(', ')}]`,
      });
      return;
    }

    next();
  };
};
