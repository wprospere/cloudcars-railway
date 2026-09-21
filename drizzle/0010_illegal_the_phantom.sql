CREATE TABLE `fleet_partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`fleetSize` varchar(64),
	`operatorLicenceNumber` varchar(128),
	`operatorLicenceAuthority` varchar(255),
	`message` text,
	`internalNotes` text,
	`assignedTo` varchar(255),
	`status` enum('pending','contacted','approved','declined') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fleet_partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `admin_activity` MODIFY COLUMN `entityType` enum('driver_application','corporate_inquiry','contact_message','fleet_partner') NOT NULL;--> statement-breakpoint
CREATE INDEX `ix_fleet_partners_status` ON `fleet_partners` (`status`);--> statement-breakpoint
CREATE INDEX `ix_fleet_partners_created` ON `fleet_partners` (`createdAt`);--> statement-breakpoint
CREATE INDEX `ix_fleet_partners_assigned` ON `fleet_partners` (`assignedTo`);--> statement-breakpoint
CREATE INDEX `ix_fleet_partners_email` ON `fleet_partners` (`email`);--> statement-breakpoint
CREATE INDEX `ix_fleet_partners_phone` ON `fleet_partners` (`phone`);