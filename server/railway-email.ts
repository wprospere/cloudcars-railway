import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

// Initialize Mailgun client
const getMailgunClient = () => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const apiBaseUrl = process.env.MAILGUN_API_BASE_URL || 'https://api.mailgun.net';

  if (!apiKey || !domain) {
    console.warn('Mailgun not configured - emails will not be sent');
    return null;
  }

  return mailgun.client({
    username: 'api',
    key: apiKey,
    url: apiBaseUrl,
  });
};

export async function sendEmail({
  to,
  subject,
  html,
  from = 'Cloud Cars <noreply@cloudcarsltd.com>',
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<boolean> {
  const mg = getMailgunClient();
  
  if (!mg) {
    console.log('Email would be sent to:', to, 'Subject:', subject);
    return false;
  }

  try {
    const domain = process.env.MAILGUN_DOMAIN!;
    await mg.messages.create(domain, {
      from,
      to: [to],
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

// Stub for owner notifications (not needed for Railway)
export async function notifyOwner({
  title,
  content,
}: {
  title: string;
  content: string;
}): Promise<boolean> {
  console.log('Owner notification:', title, '-', content);
  // You could send an email to the owner here if needed
  return true;
}
