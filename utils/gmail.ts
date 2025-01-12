import { DraftData } from '../toolbox/tools/local/email/types/draft';
import { EmailResult } from '../toolbox/tools/local/email/types/email';

export async function sendEmail(emailData: DraftData): Promise<EmailResult> {
  // Transform the data to match API expectations
  const payload = {
    subject: emailData.subject,
    to: emailData.recipients.to.join(';'),
    body: emailData.content,
  };

  const response = await fetch('http://0.0.0.0:8001/gmail/send', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send email');
  }

  // Transform response to match EmailResult type
  const data = await response.json();
  return {
    ...data
  };
}
