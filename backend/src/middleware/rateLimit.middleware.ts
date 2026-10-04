import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Max requests per window
  message: string;
  statusCode?: number;
  keyGenerator?: (req: Request) => string;
}

/**
 * Creates an in-memory sliding-window rate limiter
 */
export const createRateLimiter = (options: RateLimitOptions) => {
  const store: RateLimitStore = {};
  const {
    windowMs,
    max,
    message,
    statusCode = 429,
    keyGenerator = (req: Request) => {
      // Use IP address or forwarded-for
      const forwarded = req.headers['x-forwarded-for'];
      if (typeof forwarded === 'string') {
        return forwarded.split(',')[0].trim();
      }
      return req.ip || req.socket.remoteAddress || '127.0.0.1';
    },
  } = options;

  // Cleanup expired entries periodically (every 5 minutes)
  setInterval(() => {
    const now = Date.now();
    for (const key of Object.keys(store)) {
      if (store[key].resetTime <= now) {
        delete store[key];
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const now = Date.now();

    if (!store[key] || store[key].resetTime <= now) {
      // First request or window expired
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      // Increment request count
      store[key].count += 1;
    }

    const current = store[key];
    const remaining = Math.max(0, max - current.count);
    const resetSeconds = Math.ceil((current.resetTime - now) / 1000);

    // Standard RateLimit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(current.resetTime / 1000));

    if (current.count > max) {
      res.setHeader('Retry-After', resetSeconds);
      res.status(statusCode).json({
        success: false,
        error: 'Too Many Requests',
        message,
        retryAfterSeconds: resetSeconds,
      });
      return;
    }

    next();
  };
};

/**
 * Strict rate limiter for Authentication (Login / Register)
 * Max 10 attempts per 15 minutes per IP to prevent brute-force attacks
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
});

/**
 * General API rate limiter
 * Max 300 requests per 15 minutes per IP
 */
export const generalApiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: 'API rate limit exceeded. Please slow down your requests.',
});

/**
 * High-throughput rate limiter for Gate Scanner
 * Max 120 scans per minute per IP
 */
export const gateScanRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  message: 'Gate scan rate limit reached. Please wait a few seconds before scanning again.',
});
