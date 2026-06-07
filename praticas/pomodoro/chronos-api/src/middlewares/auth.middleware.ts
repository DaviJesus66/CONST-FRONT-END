import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

// Extende o tipo Request do Express para incluir o userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}