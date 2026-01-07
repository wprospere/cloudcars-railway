-- 20260103_create_driver_documents.sql
-- Creates driver_documents table (uploads + review + expiry)
-- Matches drizzle/schema.ts exactly

CREATE TABLE IF NOT EXISTS `driver_documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `driverApplicationId` int NOT NULL,

  `type` enum(
    'LICENSE_FRONT',
    'LICENSE_BACK',
    'BADGE',
    'PLATING',
    'INSURANCE',
    'MOT'
  ) NOT NULL,

  `fileUrl` text NOT NULL,

  `status` enum('pending', 'approved', 'rejected')
    NOT NULL
    DEFAULT 'pending',

  `expiryDate` date DEFAULT NULL,

  `rejectionReason` text DEFAULT NULL,
  `uploadedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reviewedAt` timestamp NULL DEFAULT NULL,
  `reviewedBy` varchar(320) DEFAULT NULL,

  PRIMARY KEY (`id`),
  KEY `ix_driver_documents_app` (`driverApplicationId`),
  KEY `ix_driver_documents_type` (`type`),
  KEY `ix_driver_documents_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
