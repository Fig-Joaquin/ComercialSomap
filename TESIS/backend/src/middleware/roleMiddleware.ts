import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt';
import logger from '../utils/logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('No hay Token');
    return res.status(401).json({ message: 'No existe Token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    logger.error('Invalid token: %o', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user && roles.some(role => user.roles.includes(role))) {
      next();
    } else {
      logger.warn('No tienes permisos suficientes');
      return res.status(403).json({ message: 'No tienes permisos suficientes' });
    }
  };
};
