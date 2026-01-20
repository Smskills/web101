
// @ts-ignore
import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: ENV.SMTP.HOST,
    port: ENV.SMTP.PORT,
    secure: ENV.SMTP.SECURE,
    pool: true, 
    maxConnections: 5,
    maxMessages: 100,
    auth: {
      user: ENV.SMTP.USER,
      pass: ENV.SMTP.PASS,
    },
  });

  /**
   * Sends a secure recovery link to the administrator.
   */
  static async sendPasswordResetLink(email: string, token: string, username: string) {
    const resetUrl = `http://localhost:3000/#/reset-password?token=${token}`;
    
    const htmlContent = `
      <div style="font-family: sans-serif; padding: 40px; background: #f8fafc; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <div style="background: #0f172a; padding: 30px; text-align: center;">
            <h1 style="color: #10b981; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">S M Skills</h1>
            <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 12px; font-weight: bold; letter-spacing: 1px;">Access Recovery Protocol</p>
          </div>
          <div style="padding: 40px;">
            <h2 style="margin-top: 0; font-size: 20px; color: #0f172a;">Password Reset Request</h2>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">Hello <strong>${username}</strong>,</p>
            <p style="font-size: 15px; line-height: 1.6; color: #475569;">We received a request to reset your administrator password for the S M Skills Portal. If you did not make this request, please ignore this email.</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background: #059669; color: #ffffff; padding: 18px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.3);">Reset My Password</a>
            </div>

            <p style="font-size: 12px; color: #64748b; background: #f1f5f9; padding: 15px; border-radius: 10px; text-align: center;">
              This link is valid for <strong>60 minutes</strong> and can only be used once.
            </p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 40px 0;" />
            <p style="font-size: 11px; color: #94a3b8; margin: 0; text-align: center;">
              Institutional Security Standards • Automated System Notification
            </p>
          </div>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"S M Skills Security" <${ENV.SMTP.USER}>`,
        to: email,
        subject: "Action Required: Reset Your Password",
        html: htmlContent,
      });
      console.log(`✅ Recovery Link sent to ${email}`);
    } catch (err) {
      console.error('❌ Recovery dispatch failed:', err);
      throw err;
    }
  }

  static async notifyNewLead(leadData: any, recipients: string[]) {
    if (!recipients || recipients.length === 0) return;

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
        <h2 style="color: #059669; margin-top: 0;">New ${leadData.source === 'enrollment' ? 'Enrollment Application' : 'General Enquiry'}</h2>
        <p style="color: #666; font-size: 14px;">A new submission was received on the S M Skills website.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #888; width: 150px;">Student Name:</td><td style="padding: 8px 0; font-weight: bold; color: #111;">${leadData.fullName}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Email:</td><td style="padding: 8px 0; font-weight: bold; color: #111;">${leadData.email}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Phone:</td><td style="padding: 8px 0; font-weight: bold; color: #111;">${leadData.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Course:</td><td style="padding: 8px 0; font-weight: bold; color: #059669;">${leadData.course}</td></tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #cbd5e1;">
            <p style="margin: 0; color: #475569; font-size: 13px;"><strong>Message:</strong></p>
            <p style="margin: 10px 0 0 0; color: #1e293b; line-height: 1.5;">${leadData.message || 'No additional comments provided.'}</p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"S M Skills Portal" <${ENV.SMTP.USER}>`,
        to: recipients.join(', '),
        subject: `New Lead: ${leadData.fullName} (${leadData.course})`,
        html: htmlContent,
      });
    } catch (err) {
      console.error('❌ Background Email failed:', err);
    }
  }
}
