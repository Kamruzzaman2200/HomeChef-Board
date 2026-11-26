import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = registerSchema.parse(req.body);
      const user = await AuthService.register(validated);

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = loginSchema.parse(req.body);
      const user = await AuthService.login(validated);

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      req.session.destroy((err) => {
        if (err) {
          next(err);
          return;
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Successfully signed out' });
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.session?.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const user = await AuthService.getUserById(req.session.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async demoSwitch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetRole = (req.body.role as 'ADMIN' | 'CUSTOMER') || 'CUSTOMER';
      const user = {
        id: targetRole === 'ADMIN' ? 'u-chef-01' : 'u-cust-01',
        name: targetRole === 'ADMIN' ? 'Chef Sarah Jenkins' : 'David Miller',
        email: targetRole === 'ADMIN' ? 'chef@homechef.local' : 'david.miller@gmail.com',
        role: targetRole,
      };

      req.session.user = user;
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}
