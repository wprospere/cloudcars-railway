import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);

// ✅ Helper: EU-safe base URL (you confirmed EU)
function getApiBaseUrl() {
  return (
    process.env.MAILGUN_API_BASE_URL ||
    process.env.MAILGUN_BASE_URL ||
    "https://api.eu.mailgun.net"
  );
}

function getMailgunClient() {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    console.warn("Mailgun not configured - emails will not be sent", {
      hasKey: !!apiKey,
      hasDomain: !!domain,
      baseUrl: getApiBaseUrl(),
    });
    return null;
  }

  return mailgun.client({
    username: "api",
    key: apiKey,
    url: getApiBaseUrl(), // ✅ EU by default
  });
}

export async function sendEmail({
  to,
  subject,
  html,
  from = "Cloud Cars <no-reply@cloudcarsltd.com>",
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<boolean> {
  const mg = getMailgunClient();

  if (!mg) {
    console.log("Email NOT sent (Mailgun not configured):", { to, subject });
    return false;
  }

  try {
    const domain = process.env.MAILGUN_DOMAIN!;
    await mg.messages.create(domain, {
      from,
      to, // ✅ Mailgun accepts string; no need for [to]
      subject,
      html,
    });
    return true;
  } catch (err: any) {
    // ✅ This will show the REAL reason in Railway logs
    console.error("Failed to send email (Mailgun):", {
      status: err?.status,
      message: err?.message,
      details: err?.details,
      baseUrl: getApiBaseUrl(),
      domain: process.env.MAILGUN_DOMAIN,
      keyStartsWith: process.env.MAILGUN_API_KEY?.slice(0, 4),
      to,
      from,
    });
    return false;
  }
}

// If you want owner notifications later, you can wire it to sendEmail.
// For now, keep as log-only.
export async function notifyOwner({
  title,
  content,
}: {
  title: string;
  content: string;
}): Promise<boolean> {
  console.log("Owner notification:", title, "-", content);
  return true;
}
