
import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { sendResponse } from '../utils/response';

export class ConfigController {
  /**
   * Fetch the global site configuration from MySQL
   */
  static async getConfig(req: Request, res: Response, next: NextFunction) {
    try {
      // We store the entire JSON state in a single row for maximum flexibility with the JSON-driven UI
      const [rows]: any = await pool.execute('SELECT config_json FROM site_config WHERE id = 1');
      
      if (rows.length === 0) {
        return sendResponse(res, 200, true, 'Default configuration active', null);
      }
      
      const config = JSON.parse(rows[0].config_json);
      return sendResponse(res, 200, true, 'Configuration retrieved', config);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update the global site configuration (Upsert logic)
   */
  static async updateConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const config = (req as any).body;
      const configStr = JSON.stringify(config);

      // Using ON DUPLICATE KEY UPDATE to ensure we only ever have one master config row (ID: 1)
      await pool.execute(
        'INSERT INTO site_config (id, config_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE config_json = ?',
        [configStr, configStr]
      );

      return sendResponse(res, 200, true, 'Configuration synchronized to database');
    } catch (error) {
      next(error);
    }
  }
}
