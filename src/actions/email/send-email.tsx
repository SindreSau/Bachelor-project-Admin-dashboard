'use server';

import { Resend } from 'resend';
import ConfirmationEmail from './templates/confirmation-email';

const resend = new Resend(process.env.RESEND_API_TOKEN || '');

export async function sendTestEmail(
  from: string = process.env.RESEND_FROM_EMAIL || '',
  to: string = 'test@example.no', // CHANGE THIS TO EMAIL FROM APPLICATION FORM (GRUPPEANSVARLIG)
  subject: string = 'Default Subject',
  html: string = '<p>This is a default email body.</p>'
) {
  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export const sendConfirmationEmail = async (to: string, studentContactFirstName: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || '',
      to,
      subject: 'Takk for din søknad',
      react: (
        <ConfirmationEmail
          name={studentContactFirstName}
          respondableEmail={process.env.RESPONDABLE_EMAIL || undefined}
        />
      ),
    });

    if (error) {
      console.error('Error sending confirmation email:', error);
      return { data: null, error };
    }

    return { data, error };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { data: null, error };
  }
};
