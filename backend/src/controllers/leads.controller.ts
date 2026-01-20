
import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { sendResponse } from '../utils/response';
import { EmailService } from '../services/email.service'; 

export class LeadsController {
  /**
   * Create a new lead from Website form
   */
  static async createLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { fullName, email, phone, course, message, source, details } = (req as any).body;

      if (!fullName || !email || !phone) {
        return sendResponse(res, 400, false, 'Required fields: Name, Email, and Phone are mandatory.');
      }

      const [result]: any = await pool.execute(
        'INSERT INTO leads (full_name, email, phone, course, message, source, status, details, created_at) VALUES (?, ?, ?, ?, ?, ?, "New", ?, NOW())',
        [fullName, email, phone, course, message, source, JSON.stringify(details || {})]
      );

      // BACKGROUND TASK: Find recipients and send email
      (async () => {
        try {
          const [configRows]: any = await pool.execute('SELECT config_json FROM site_config WHERE id = 1');
          
          if (configRows.length > 0) {
            const siteData = JSON.parse(configRows[0].config_json);
            // The Admin panel saves notification emails inside the 'site' object
            const recipients = siteData.site?.notificationEmails || [];

            if (recipients.length > 0) {
              await EmailService.notifyNewLead((req as any).body, recipients);
            } else {
              console.log('ℹ️ Email Service: No recipients found in Site Config. Check Admin > Site tab.');
            }
          }
        } catch (emailError) {
          console.error("❌ Email Dispatch Failed:", emailError);
        }
      })();

      return sendResponse(res, 201, true, 'Your enquiry has been received.', { id: result.insertId });
    } catch (error) {
      next(error);
    }
  }

  static async getAllLeads(req: Request, res: Response, next: NextFunction) {
    try {
      const [rows] = await pool.execute('SELECT * FROM leads ORDER BY created_at DESC');
      return sendResponse(res, 200, true, 'Leads retrieved', rows);
    } catch (error) {
      next(error);
    }
  }

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

  static async deleteLead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = (req as any).params;
      await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
      return sendResponse(res, 200, true, 'Lead removed');
    } catch (error) {
      next(error);
    }
  }
}
