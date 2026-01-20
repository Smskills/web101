
// @ts-ignore
import nodemailer from 'nodemailer';
import { ENV } from '../config/env';

export class EmailService {
  private static getTransporter() {
    return nodemailer.createTransport({
      host: ENV.SMTP.HOST,
      port: ENV.SMTP.PORT,
      secure: ENV.SMTP.SECURE,
      auth: {
        user: ENV.SMTP.USER,
        pass: ENV.SMTP.PASS.replace(/\s+/g, ''), // Auto-strip spaces if user left them in .env
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  static async sendPasswordResetLink(email: string, token: string, username: string) {
    const resetUrl = `http://localhost:3000/#/reset-password?token=${token}`;
    const transporter = this.getTransporter();

    try {
      await transporter.sendMail({
        from: `"Institutional Security" <${ENV.SMTP.USER}>`,
        to: email,
        subject: "Password Reset Request",
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hello ${username},</h2>
            <p>Click the button below to reset your S M Skills admin password.</p>
            <a href="${resetUrl}" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
            <p>This link expires in 1 hour.</p>
          </div>
        `
      });
      console.log('✅ Email Service: Recovery link sent to', email);
    } catch (err: any) {
      console.error('❌ Email Service Error (Auth):', err.message);
      throw err;
    }
  }

  static async notifyNewLead(leadData: any, recipients: string[]) {
    const transporter = this.getTransporter();
    try {
      await transporter.sendMail({
        from: `"Website Leads" <${ENV.SMTP.USER}>`,
        to: recipients.join(','),
        subject: `New Lead: ${leadData.fullName}`,
        html: `
          <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #059669;">New Website Submission</h2>
            <p><strong>Name:</strong> ${leadData.fullName}</p>
            <p><strong>Email:</strong> ${leadData.email}</p>
            <p><strong>Phone:</strong> ${leadData.phone}</p>
            <p><strong>Program:</strong> ${leadData.course}</p>
            <p><strong>Message:</strong> ${leadData.message || 'N/A'}</p>
          </div>
        `
      });
      console.log('✅ Email Service: Lead notification sent to staff.');
    } catch (err: any) {
      console.error('❌ Email Service Error (Lead):', err.message);
    }
  }
}
