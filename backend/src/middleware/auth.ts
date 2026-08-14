import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

export interface AuthedRequest extends Request {
  auth?: TokenPayload;
}

export const requireRole = (role: 'admin' | 'manager' | 'sponsor') =>
  (req: AuthedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
    try {
      const payload = verifyToken(header.slice(7));
      if (payload.role !== role) return res.status(403).json({ error: 'Forbidden' });
      req.auth = payload;
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
  };