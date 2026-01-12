CREATE TABLE `admin_audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`admin_user_id` int NOT NULL,
	`action` varchar(80) NOT NULL,
	`entity_type` varchar(40) NOT NULL,
	`entity_id` int,
	`metadata` json,
	`ip` varchar(64),
	`user_agent` text,
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `admin_audit_log_id` PRIMARY KEY(`id`)
);
