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
