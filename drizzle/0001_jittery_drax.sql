ALTER TABLE `driver_onboarding_tokens` ADD `revokedAt` timestamp;--> statement-breakpoint
ALTER TABLE `driver_onboarding_tokens` ADD `lastSentAt` timestamp;--> statement-breakpoint
ALTER TABLE `driver_onboarding_tokens` ADD `sendCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `driver_onboarding_tokens` ADD CONSTRAINT `ux_driver_onboarding_token_hash` UNIQUE(`tokenHash`);--> statement-breakpoint
CREATE INDEX `ix_driver_onboarding_app` ON `driver_onboarding_tokens` (`driverApplicationId`);--> statement-breakpoint
CREATE INDEX `ix_driver_onboarding_expires` ON `driver_onboarding_tokens` (`expiresAt`);