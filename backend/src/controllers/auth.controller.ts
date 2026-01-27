<<<<<<< HEAD
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model'; // adjust path if needed

export class AuthService {
  static async login(identifier: string, password: string) {
    // 1️⃣ Find user by email OR username
    const user = await User.findOne({
      where: {
        email: identifier,
      },
    }) || await User.findOne({
      where: {
        username: identifier,
      },
    });
=======

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendResponse } from '../utils/response';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Fix: Cast req to any as Request type in this environment does not expose 'body'
      const { identifier, password } = (req as any).body;
>>>>>>> 964abf81776e6c021d5871ef98008b5701eb44a1

    // 2️⃣ User not found
    if (!user) {
      return null;
    }

    // 3️⃣ Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // 4️⃣ Password incorrect
    if (!isMatch) {
      return null;
    }

    // 5️⃣ Generate token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // 6️⃣ Return auth data
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }
}
