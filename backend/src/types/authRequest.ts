import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean; 
    };
  }