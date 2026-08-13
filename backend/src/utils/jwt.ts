import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'dev-only-fallback-secret';

export type TokenPayload = { id: string; role: 'admin' | 'manager' };

export const signToken = (payload: TokenPayload) => jwt.sign(payload, SECRET, { expiresIn: '12h' });
export const verifyToken = (token: string) => jwt.verify(token, SECRET) as TokenPayload;