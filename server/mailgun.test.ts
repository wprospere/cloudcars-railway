import { describe, it, expect } from "vitest";
import { sendEmail } from "./_core/emailService";

describe("Mailgun Email Service", () => {
  it("should have valid Mailgun credentials configured", async () => {
    // Check environment variables are set
    expect(process.env.MAILGUN_API_KEY).toBeDefined();
    expect(process.env.MAILGUN_DOMAIN).toBeDefined();
    expect(process.env.MAILGUN_API_BASE_URL).toBeDefined();
    
    // Verify API base URL is EU region
    expect(process.env.MAILGUN_API_BASE_URL).toBe("https://api.eu.mailgun.net");
  });

  it("should successfully send a test email", async () => {
    // Send a test email to verify credentials work
    const result = await sendEmail({
      to: "test@example.com", // Mailgun sandbox will validate but not actually send
      subject: "Test Email - Mailgun Credential Validation",
      text: "This is a test email to validate Mailgun credentials.",
    });

    // If credentials are valid, sendEmail should return true
    // If invalid, it will return false or throw an error
    expect(result).toBe(true);
  }, 10000); // 10 second timeout for API call
});
