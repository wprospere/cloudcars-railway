ALTER TABLE `admin_activity` MODIFY COLUMN `action` enum('CREATED','STATUS_CHANGED','ASSIGNED','NOTE_ADDED','LINK_SENT','REMINDER_SENT','DOC_REVIEWED') NOT NULL;--> statement-breakpoint
ALTER TABLE `driver_applications` MODIFY COLUMN `status` enum('pending','reviewing','link_sent','docs_received','approved','rejected') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `driver_applications` ADD `assignedToAdminId` int;--> statement-breakpoint
ALTER TABLE `driver_applications` ADD `assignedToEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `driver_applications` ADD `lastTouchedAt` timestamp;--> statement-breakpoint
ALTER TABLE `driver_applications` ADD `lastTouchedByEmail` varchar(320);--> statement-breakpoint
CREATE INDEX `ix_admin_audit_created` ON `admin_audit_log` (`created_at`);--> statement-breakpoint
CREATE INDEX `ix_admin_audit_entity` ON `admin_audit_log` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `ix_admin_audit_admin` ON `admin_audit_log` (`admin_user_id`);--> statement-breakpoint
CREATE INDEX `ix_admin_users_email` ON `admin_users` (`email`);--> statement-breakpoint
CREATE INDEX `ix_bookings_status` ON `bookings` (`status`);--> statement-breakpoint
CREATE INDEX `ix_bookings_created` ON `bookings` (`createdAt`);--> statement-breakpoint
CREATE INDEX `ix_bookings_email` ON `bookings` (`customerEmail`);--> statement-breakpoint
CREATE INDEX `ix_corp_phone` ON `corporate_inquiries` (`phone`);--> statement-breakpoint
CREATE INDEX `ix_driver_app_assigned_admin` ON `driver_applications` (`assignedToAdminId`);--> statement-breakpoint
CREATE INDEX `ix_driver_app_assigned_email` ON `driver_applications` (`assignedToEmail`);--> statement-breakpoint
CREATE INDEX `ix_driver_app_last_touched` ON `driver_applications` (`lastTouchedAt`);--> statement-breakpoint
CREATE INDEX `ix_driver_app_license` ON `driver_applications` (`licenseNumber`);--> statement-breakpoint
CREATE INDEX `ix_team_members_active` ON `team_members` (`is_active`);--> statement-breakpoint
CREATE INDEX `ix_team_members_email` ON `team_members` (`email`);--> statement-breakpoint
CREATE INDEX `ix_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `ix_users_role` ON `users` (`role`);