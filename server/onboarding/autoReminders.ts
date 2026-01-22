// server/onboarding/autoReminders.ts

/**
 * Automatic onboarding reminders (cron job).
 *
 * This is a safe starter implementation to unblock Railway deploy.
 * You can expand it later to:
 *  - query pending driver onboardings
 *  - send reminder emails
 *  - log reminder events to admin activity timeline
 */
export async function runAutoOnboardingReminders(): Promise<{
  checked: number;
  sent: number;
  skipped: number;
}> {
  // TODO: implement real reminder logic
  return { checked: 0, sent: 0, skipped: 0 };
}
