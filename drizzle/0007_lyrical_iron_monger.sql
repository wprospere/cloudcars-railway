ALTER TABLE `driver_applications` ADD `archivedAt` timestamp;--> statement-breakpoint
ALTER TABLE `driver_applications` ADD `archivedByEmail` varchar(320);--> statement-breakpoint
CREATE INDEX `ix_driver_app_archived` ON `driver_applications` (`archivedAt`);