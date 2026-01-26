CREATE TABLE `policy_docs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`markdown` text NOT NULL,
	`last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `policy_docs_id` PRIMARY KEY(`id`),
	CONSTRAINT `policy_docs_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `ux_policy_docs_slug` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `ix_policy_docs_updated` ON `policy_docs` (`updated_at`);