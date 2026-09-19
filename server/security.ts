import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from './db';

/**
 * Constant Project Identifier (Metadata, not a secret key).
 */
export const PROJECT_ID = 'TOOLVERSE' as const;

/**
 * Strict Allowlist of Operations for Agent / Admin management.
 * Any request attempting an unlisted operation is rejected by policy.
 */
export const ALLOWED_OPERATIONS = [
  'GET /api/agent/v1/meta',
  'GET /api/agent/v1/tools',
  'GET /api/agent/v1/tools/:id',
  'POST /api/agent/v1/tools',
  'PUT /api/agent/v1/tools/:id',
  'DELETE /api/agent/v1/tools/:id',
  'GET /api/agent/v1/categories',
  'GET /api/agent/v1/categories/:id',
  'POST /api/agent/v1/categories',
  'PUT /api/agent/v1/categories/:id',
  'DELETE /api/agent/v1/categories/:id',
  'GET /api/agent/v1/audit-log'
] as const;

/**
 * Simple in-memory Rate Limiter
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

export function rateLimiter(limit = 120, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    record.count += 1;
    if (record.count > limit) {
      res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
      return;
    }

    next();
  };
}

/**
 * Sanitized Hash of IP for audit logs without exposing plain PII
 */
export function hashIp(req: Request): string {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 12);
}

/**
 * Timing-safe string comparison to prevent timing attacks.
 */
function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, 'utf-8');
    const bufB = Buffer.from(b, 'utf-8');
    if (bufA.length !== bufB.length) {
      // Execute dummy timing to avoid leak
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Agent / Admin Secret Authentication Middleware
 * Strictly reads from server-side environment variable TOOLVERSE_AGENT_SECRET.
 * Never leaks or prints the secret value.
 */
export function authenticateAgent(req: Request, res: Response, next: NextFunction): void {
  const serverSecret = process.env.TOOLVERSE_AGENT_SECRET;

  // If the secret is not configured on the server
  if (!serverSecret || serverSecret.trim() === '') {
    db.appendAuditLog({
      operation: `${req.method} ${req.originalUrl || req.path}`,
      source: 'agent',
      targetType: 'system',
      success: false,
      message: 'Authentication rejected: TOOLVERSE_AGENT_SECRET is not configured on server',
      ipHash: hashIp(req)
    });

    res.status(503).json({
      error: 'Service Unavailable',
      message: 'Management API authentication is not configured on this server.'
    });
    return;
  }

  // Extract secret from header: either `x-toolverse-secret` or `Authorization: Bearer <secret>`
  let clientSecret: string | undefined;
  const customHeader = req.headers['x-toolverse-secret'];
  if (typeof customHeader === 'string') {
    clientSecret = customHeader.trim();
  } else if (req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      clientSecret = parts[1].trim();
    }
  }

  // Missing credential
  if (!clientSecret) {
    db.appendAuditLog({
      operation: `${req.method} ${req.originalUrl || req.path}`,
      source: 'agent',
      targetType: 'system',
      success: false,
      message: 'Unauthorized: missing agent credentials header',
      ipHash: hashIp(req)
    });

    res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing management authentication credentials.'
    });
    return;
  }

  // Verify credential with timing-safe comparison
  const isValid = safeCompare(clientSecret, serverSecret.trim());
  if (!isValid) {
    db.appendAuditLog({
      operation: `${req.method} ${req.originalUrl || req.path}`,
      source: 'agent',
      targetType: 'system',
      success: false,
      message: 'Unauthorized: invalid secret token provided',
      ipHash: hashIp(req)
    });

    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid management authentication credentials.'
    });
    return;
  }

  // Authenticated successfully
  next();
}

/**
 * Allowlist Enforcement Middleware
 * Ensures the Agent or Admin cannot invoke unapproved endpoints.
 */
export function enforceAllowlist(req: Request, res: Response, next: NextFunction): void {
  const method = req.method.toUpperCase();
  const path = req.baseUrl ? `${req.baseUrl}${req.path}` : req.path;

  // Normalize path pattern (e.g. /api/agent/v1/tools/chatgpt -> /api/agent/v1/tools/:id)
  const normalizedPath = path.replace(/\/api\/agent\/v1\/tools\/[^/]+$/, '/api/agent/v1/tools/:id')
                             .replace(/\/api\/agent\/v1\/categories\/[^/]+$/, '/api/agent/v1/categories/:id');

  const action = `${method} ${normalizedPath}`;
  const isAllowed = ALLOWED_OPERATIONS.includes(action as typeof ALLOWED_OPERATIONS[number]);

  if (!isAllowed) {
    db.appendAuditLog({
      operation: action,
      source: 'agent',
      targetType: 'system',
      success: false,
      message: `Operation "${action}" rejected: not on server allowlist`,
      ipHash: hashIp(req)
    });

    res.status(403).json({
      error: 'Forbidden',
      message: `Operation "${action}" is not allowed by system policy.`
    });
    return;
  }

  next();
}
