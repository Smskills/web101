
import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { sendResponse } from '../utils/response';
import { EmailService } from '../services/email.service'; 

export class LeadsController {
  /**
   * Create a new lead from Website form
   * Optimized for resilience against missing 'details' or 'source' columns.
   */
  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phone, course, message, source, details } = (req as any).body;

      if (!fullName || !email || !phone) {
        return sendResponse(res, 400, false, 'Required fields missing');
      }

      let resultId: number = 0;

      // Primary Attempt: Full insert with all columns
      try {
        const [result]: any = await pool.execute(
          'INSERT INTO leads (full_name, email, phone, course, message, source, status, details, created_at) VALUES (?, ?, ?, ?, ?, ?, "New", ?, NOW())',
          [fullName, email, phone, course, message, source, JSON.stringify(details || {})]
        );
        resultId = result.insertId;
      } catch (dbError: any) {
        // Fallback Attempt: If 'details' or 'source' is missing, try a basic insert
        if (dbError.code === 'ER_BAD_FIELD_ERROR') {
          const [result]: any = await pool.execute(
            'INSERT INTO leads (full_name, email, phone, course, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [fullName, email, phone, course, message]
          );
          resultId = result.insertId;
          console.warn("DB Resilience: Using fallback insert for leads. Update your table schema for full data capture.");
        } else {
          throw dbError;
        }
      }

      // BACKGROUND PATH: Dispatch email notification
      (async () => {
        try {
          const [configRows]: any = await pool.execute('SELECT notification_emails FROM site_config WHERE id = 1');
          
          let recipients: string[] = [];
          if (configRows && configRows[0]?.notification_emails) {
            const raw = configRows[0].notification_emails;
            recipients = typeof raw === 'string' ? JSON.parse(raw) : raw;
          }

          if (recipients.length > 0) {
            await EmailService.notifyNewLead((req as any).body, recipients);
          }
        } catch (emailError) {
          console.error("Critical: Background notification failed:", emailError);
        }
      })();

      return sendResponse(res, 201, true, 'Application processed successfully', { id: resultId });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all leads for dashboard
   */
  static async getAllLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const [rows] = await pool.execute('SELECT * FROM leads ORDER BY created_at DESC');
      return sendResponse(res, 200, true, 'Leads retrieved', rows);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Status
   */
  static async updateLeadStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).params;
      const { status } = (req as any).body;
      await pool.execute('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
      return sendResponse(res, 200, true, 'Status updated');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Lead
   */
  static async deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).params;
      await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
      return sendResponse(res, 200, true, 'Lead record removed');
    } catch (error) {
      next(error);
    }
  }
}
