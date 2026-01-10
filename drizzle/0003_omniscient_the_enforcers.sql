CREATE TABLE `admin_activity` (
	`id` int AUTO_INCREMENT NOT NULL,
	`entityType` enum('driver_application','corporate_inquiry','contact_message') NOT NULL,
	`entityId` int NOT NULL,
	`action` enum('CREATED','STATUS_CHANGED','ASSIGNED','NOTE_ADDED','LINK_SENT','DOC_REVIEWED') NOT NULL,
	`meta` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`adminEmail` varchar(320),
	CONSTRAINT `admin_activity_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('admin','staff') NOT NULL DEFAULT 'admin',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerPhone` varchar(32) NOT NULL,
	`serviceType` enum('standard','courier','airport','executive') NOT NULL,
	`pickupAddress` text NOT NULL,
	`destinationAddress` text NOT NULL,
	`pickupDate` varchar(32) NOT NULL,
	`pickupTime` varchar(16) NOT NULL,
	`passengers` int NOT NULL DEFAULT 1,
	`specialRequests` text,
	`estimatedPrice` int,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32),
	`subject` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`internalNotes` text,
	`assignedTo` varchar(255),
	`isRead` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `corporate_inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`estimatedMonthlyTrips` varchar(64),
	`requirements` text,
	`internalNotes` text,
	`assignedTo` varchar(255),
	`status` enum('pending','contacted','converted','declined') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `corporate_inquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `driver_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`licenseNumber` varchar(64) NOT NULL,
	`yearsExperience` int NOT NULL,
	`vehicleOwner` boolean NOT NULL DEFAULT false,
	`vehicleType` varchar(128),
	`availability` enum('fulltime','parttime','weekends') NOT NULL,
	`message` text,
	`internalNotes` text,
	`assignedTo` varchar(255),
	`status` enum('pending','reviewing','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `driver_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `driver_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`driverApplicationId` int NOT NULL,
	`type` enum('LICENSE_FRONT','LICENSE_BACK','BADGE','PLATING','INSURANCE','MOT') NOT NULL,
	`fileUrl` text NOT NULL,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`expiryDate` date,
	`rejectionReason` text,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	`reviewedAt` timestamp,
	`reviewedBy` varchar(320),
	CONSTRAINT `driver_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `driver_onboarding_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`driverApplicationId` int NOT NULL,
	`tokenHash` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`usedAt` timestamp,
	`revokedAt` timestamp,
	`lastSentAt` timestamp,
	`sendCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `driver_onboarding_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `ux_driver_onboarding_token_hash` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `driver_vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`driverApplicationId` int NOT NULL,
	`registration` varchar(32) NOT NULL,
	`make` varchar(64) NOT NULL,
	`model` varchar(64) NOT NULL,
	`colour` varchar(32) NOT NULL,
	`year` varchar(8),
	`plateNumber` varchar(64),
	`capacity` varchar(8),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `driver_vehicles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectionKey` varchar(128) NOT NULL,
	`title` text,
	`subtitle` text,
	`description` text,
	`buttonText` varchar(128),
	`buttonLink` varchar(255),
	`extraData` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_content_sectionKey_unique` UNIQUE(`sectionKey`)
);
--> statement-breakpoint
CREATE TABLE `site_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`imageKey` varchar(128) NOT NULL,
	`url` text NOT NULL,
	`altText` varchar(255),
	`caption` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_images_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_images_imageKey_unique` UNIQUE(`imageKey`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255),
	`role` varchar(100),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `ix_admin_activity_entity` ON `admin_activity` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `ix_admin_activity_created` ON `admin_activity` (`createdAt`);--> statement-breakpoint
CREATE INDEX `ix_admin_activity_action` ON `admin_activity` (`action`);--> statement-breakpoint
CREATE INDEX `ix_admin_users_role` ON `admin_users` (`role`);--> statement-breakpoint
CREATE INDEX `ix_msg_created` ON `contact_messages` (`createdAt`);--> statement-breakpoint
CREATE INDEX `ix_msg_isread` ON `contact_messages` (`isRead`);--> statement-breakpoint
CREATE INDEX `ix_msg_assigned` ON `contact_messages` (`assignedTo`);--> statement-breakpoint
CREATE INDEX `ix_msg_email` ON `contact_messages` (`email`);--> statement-breakpoint
CREATE INDEX `ix_corp_status` ON `corporate_inquiries` (`status`);--> statement-breakpoint
CREATE INDEX `ix_corp_created` ON `corporate_inquiries` (`createdAt`);--> statement-breakpoint
CREATE INDEX `ix_corp_assigned` ON `corporate_inquiries` (`assignedTo`);--> statement-breakpoint
CREATE INDEX `ix_corp_email` ON `corporate_inquiries` (`email`);--> statement-breakpoint
CREATE INDEX `ix_driver_app_status` ON `driver_applications` (`status`);--> statement-breakpoint
CREATE INDEX `ix_driver_app_created` ON `driver_applications` (`createdAt`);--> statement-breakpoint
CREATE INDEX `ix_driver_app_assigned` ON `driver_applications` (`assignedTo`);--> statement-breakpoint
CREATE INDEX `ix_driver_app_email` ON `driver_applications` (`email`);--> statement-breakpoint
CREATE INDEX `ix_driver_app_phone` ON `driver_applications` (`phone`);--> statement-breakpoint
CREATE INDEX `ix_driver_docs_app` ON `driver_documents` (`driverApplicationId`);--> statement-breakpoint
CREATE INDEX `ix_driver_docs_type` ON `driver_documents` (`type`);--> statement-breakpoint
CREATE INDEX `ix_driver_docs_status` ON `driver_documents` (`status`);--> statement-breakpoint
CREATE INDEX `ix_driver_docs_uploaded` ON `driver_documents` (`uploadedAt`);--> statement-breakpoint
CREATE INDEX `ix_driver_onboarding_app` ON `driver_onboarding_tokens` (`driverApplicationId`);--> statement-breakpoint
CREATE INDEX `ix_driver_onboarding_expires` ON `driver_onboarding_tokens` (`expiresAt`);--> statement-breakpoint
CREATE INDEX `ix_driver_onboarding_last_sent` ON `driver_onboarding_tokens` (`lastSentAt`);--> statement-breakpoint
CREATE INDEX `ix_driver_vehicle_app` ON `driver_vehicles` (`driverApplicationId`);--> statement-breakpoint
CREATE INDEX `ix_driver_vehicle_reg` ON `driver_vehicles` (`registration`);