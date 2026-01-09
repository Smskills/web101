// @ts-ignore
import bcrypt from 'bcrypt';
// @ts-ignore
import jwt from 'jsonwebtoken';
import { UsersRepository } from '../repositories/users.repo';
import { ENV } from '../config/env';

export class AuthService {
  static async login(identifier: string, plainPassword: string) {
    // 1. Locate user record
    const user = await UsersRepository.findByIdentifier(identifier);
    if (!user) {
      const err: any = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    // 2. Security Check: Status must be 'active'
    if (user.status !== 'active') {
      const err: any = new Error('Account is inactive. Contact Administrator.');
      err.statusCode = 403;
      throw err;
    }

    // 3. Cryptographic Verification
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) {
      const err: any = new Error('Invalid credentials');
      err.statusCode = 401;
      throw err;
    }

    // 4. Identity Token Generation
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // 5. Data Sanitization
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }
}