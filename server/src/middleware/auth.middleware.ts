import { Request, Response, NextFunction } from 'express';

// Extend express-session types
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      name: string;
      email: string;
      role: 'CUSTOMER' | 'ADMIN';
    };
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // Check session
  if (req.session && req.session.user) {
    next();
    return;
  }

  // Support development / demo header fallback for easy testing
  const demoUserId = req.headers['x-demo-user-id'] as string;
  const demoUserRole = (req.headers['x-demo-user-role'] as 'CUSTOMER' | 'ADMIN') || 'CUSTOMER';

  if (demoUserId) {
    req.session.user = {
      id: demoUserId,
      name: demoUserRole === 'ADMIN' ? 'Chef Sarah' : 'Demo Customer',
      email: demoUserRole === 'ADMIN' ? 'chef@homechef.local' : 'customer@gmail.com',
      role: demoUserRole,
    };
    next();
    return;
  }

  res.status(401).json({ error: 'Authentication required' });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.user?.role === 'ADMIN') {
    next();
    return;
  }

  // Development header fallback
  if (req.headers['x-demo-user-role'] === 'ADMIN') {
    next();
    return;
  }

  res.status(403).json({ error: 'Access restricted to kitchen administrators' });
}
