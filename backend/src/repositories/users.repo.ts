import pool from '../config/database';

export class UsersRepository {
  /**
   * Find a user by either their unique username or email address.
   */
  static async findByIdentifier(identifier: string) {
    const query = 'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1';
    const [rows]: any = await pool.execute(query, [identifier, identifier]);
    return rows[0] || null;
  }
}