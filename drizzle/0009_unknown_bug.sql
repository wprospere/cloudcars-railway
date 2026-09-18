CREATE TABLE `customer_account_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`tokenHash` varchar(128) NOT NULL,
	`expiresAt` timestamp NOT NULL,
	`revokedAt` timestamp,
	`lastSentAt` timestamp,
	`sendCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `customer_account_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `ux_customer_account_token_hash` UNIQUE(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`phone` varchar(32) NOT NULL,
	`email` varchar(320),
	`notes` text,
	`is_active` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`invoiceNumber` varchar(64) NOT NULL,
	`amountPence` int NOT NULL,
	`issueDate` date,
	`status` enum('unpaid','paid') NOT NULL DEFAULT 'unpaid',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `ix_customer_account_tokens_customer` ON `customer_account_tokens` (`customerId`);--> statement-breakpoint
CREATE INDEX `ix_customer_account_tokens_expires` ON `customer_account_tokens` (`expiresAt`);--> statement-breakpoint
CREATE INDEX `ix_customers_phone` ON `customers` (`phone`);--> statement-breakpoint
CREATE INDEX `ix_customers_name` ON `customers` (`name`);--> statement-breakpoint
CREATE INDEX `ix_invoices_customer` ON `invoices` (`customerId`);--> statement-breakpoint
CREATE INDEX `ix_invoices_status` ON `invoices` (`status`);