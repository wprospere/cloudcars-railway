/* 0004_lumpy_stone_men.sql
   Made idempotent for environments where tables/indexes already exist.
   Safe to run multiple times.
*/

-- =========================
-- Tables (idempotent)
-- =========================

CREATE TABLE IF NOT EXISTS `admin_activity` (
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
CREATE TABLE IF NOT EXISTS `admin_users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('admin','staff') NOT NULL DEFAULT 'admin',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `admin_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `admin_users_email_unique` UNIQUE(`email`)
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `bookings` (
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
CREATE TABLE IF NOT EXISTS `contact_messages` (
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
CREATE TABLE IF NOT EXISTS `corporate_inquiries` (
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
CREATE TABLE IF NOT EXISTS `driver_applications` (
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
CREATE TABLE IF NOT EXISTS `driver_documents` (
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
CREATE TABLE IF NOT EXISTS `driver_onboarding_tokens` (
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
CREATE TABLE IF NOT EXISTS `driver_vehicles` (
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
CREATE TABLE IF NOT EXISTS `site_content` (
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
CREATE TABLE IF NOT EXISTS `site_images` (
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
CREATE TABLE IF NOT EXISTS `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255),
	`role` varchar(100),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `users` (
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

-- =========================
-- Indexes (conditionally added)
-- MySQL has no CREATE INDEX IF NOT EXISTS, so we guard via information_schema.
-- =========================

--> statement-breakpoint
SET @db = DATABASE();

-- admin_activity indexes
--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='admin_activity' AND index_name='ix_admin_activity_entity'),
    'SELECT 1',
    'ALTER TABLE `admin_activity` ADD INDEX `ix_admin_activity_entity` (`entityType`,`entityId`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='admin_activity' AND index_name='ix_admin_activity_created'),
    'SELECT 1',
    'ALTER TABLE `admin_activity` ADD INDEX `ix_admin_activity_created` (`createdAt`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='admin_activity' AND index_name='ix_admin_activity_action'),
    'SELECT 1',
    'ALTER TABLE `admin_activity` ADD INDEX `ix_admin_activity_action` (`action`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- admin_users index
--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='admin_users' AND index_name='ix_admin_users_role'),
    'SELECT 1',
    'ALTER TABLE `admin_users` ADD INDEX `ix_admin_users_role` (`role`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- contact_messages indexes
--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='contact_messages' AND index_name='ix_msg_created'),
    'SELECT 1',
    'ALTER TABLE `contact_messages` ADD INDEX `ix_msg_created` (`createdAt`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='contact_messages' AND index_name='ix_msg_isread'),
    'SELECT 1',
    'ALTER TABLE `contact_messages` ADD INDEX `ix_msg_isread` (`isRead`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='contact_messages' AND index_name='ix_msg_assigned'),
    'SELECT 1',
    'ALTER TABLE `contact_messages` ADD INDEX `ix_msg_assigned` (`assignedTo`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='contact_messages' AND index_name='ix_msg_email'),
    'SELECT 1',
    'ALTER TABLE `contact_messages` ADD INDEX `ix_msg_email` (`email`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- corporate_inquiries indexes
--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='corporate_inquiries' AND index_name='ix_corp_status'),
    'SELECT 1',
    'ALTER TABLE `corporate_inquiries` ADD INDEX `ix_corp_status` (`status`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='corporate_inquiries' AND index_name='ix_corp_created'),
    'SELECT 1',
    'ALTER TABLE `corporate_inquiries` ADD INDEX `ix_corp_created` (`createdAt`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='corporate_inquiries' AND index_name='ix_corp_assigned'),
    'SELECT 1',
    'ALTER TABLE `corporate_inquiries` ADD INDEX `ix_corp_assigned` (`assignedTo`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='corporate_inquiries' AND index_name='ix_corp_email'),
    'SELECT 1',
    'ALTER TABLE `corporate_inquiries` ADD INDEX `ix_corp_email` (`email`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- driver_applications indexes
--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_applications' AND index_name='ix_driver_app_status'),
    'SELECT 1',
    'ALTER TABLE `driver_applications` ADD INDEX `ix_driver_app_status` (`status`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_applications' AND index_name='ix_driver_app_created'),
    'SELECT 1',
    'ALTER TABLE `driver_applications` ADD INDEX `ix_driver_app_created` (`createdAt`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_applications' AND index_name='ix_driver_app_assigned'),
    'SELECT 1',
    'ALTER TABLE `driver_applications` ADD INDEX `ix_driver_app_assigned` (`assignedTo`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_applications' AND index_name='ix_driver_app_email'),
    'SELECT 1',
    'ALTER TABLE `driver_applications` ADD INDEX `ix_driver_app_email` (`email`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_applications' AND index_name='ix_driver_app_phone'),
    'SELECT 1',
    'ALTER TABLE `driver_applications` ADD INDEX `ix_driver_app_phone` (`phone`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- driver_documents indexes
--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_documents' AND index_name='ix_driver_docs_app'),
    'SELECT 1',
    'ALTER TABLE `driver_documents` ADD INDEX `ix_driver_docs_app` (`driverApplicationId`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_documents' AND index_name='ix_driver_docs_type'),
    'SELECT 1',
    'ALTER TABLE `driver_documents` ADD INDEX `ix_driver_docs_type` (`type`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_documents' AND index_name='ix_driver_docs_status'),
    'SELECT 1',
    'ALTER TABLE `driver_documents` ADD INDEX `ix_driver_docs_status` (`status`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_documents' AND index_name='ix_driver_docs_uploaded'),
    'SELECT 1',
    'ALTER TABLE `driver_documents` ADD INDEX `ix_driver_docs_uploaded` (`uploadedAt`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- driver_onboarding_tokens indexes
--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_onboarding_tokens' AND index_name='ix_driver_onboarding_app'),
    'SELECT 1',
    'ALTER TABLE `driver_onboarding_tokens` ADD INDEX `ix_driver_onboarding_app` (`driverApplicationId`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_onboarding_tokens' AND index_name='ix_driver_onboarding_expires'),
    'SELECT 1',
    'ALTER TABLE `driver_onboarding_tokens` ADD INDEX `ix_driver_onboarding_expires` (`expiresAt`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_onboarding_tokens' AND index_name='ix_driver_onboarding_last_sent'),
    'SELECT 1',
    'ALTER TABLE `driver_onboarding_tokens` ADD INDEX `ix_driver_onboarding_last_sent` (`lastSentAt`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- driver_vehicles indexes
--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_vehicles' AND index_name='ix_driver_vehicle_app'),
    'SELECT 1',
    'ALTER TABLE `driver_vehicles` ADD INDEX `ix_driver_vehicle_app` (`driverApplicationId`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

--> statement-breakpoint
SET @sql := (
  SELECT IF(
    EXISTS(SELECT 1 FROM information_schema.statistics WHERE table_schema=@db AND table_name='driver_vehicles' AND index_name='ix_driver_vehicle_reg'),
    'SELECT 1',
    'ALTER TABLE `driver_vehicles` ADD INDEX `ix_driver_vehicle_reg` (`registration`)'
  )
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
