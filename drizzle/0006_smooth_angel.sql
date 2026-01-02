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
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `driver_onboarding_tokens_id` PRIMARY KEY(`id`)
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
