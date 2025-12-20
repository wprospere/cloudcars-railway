import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const SQL_COMMANDS = [
  `CREATE TABLE IF NOT EXISTS \`team_members\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(255) NOT NULL,
    \`email\` VARCHAR(255),
    \`role\` VARCHAR(100),
    \`is_active\` BOOLEAN DEFAULT TRUE NOT NULL,
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS \`users\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`openId\` VARCHAR(64) NOT NULL UNIQUE,
    \`name\` TEXT,
    \`email\` VARCHAR(320),
    \`loginMethod\` VARCHAR(64),
    \`role\` ENUM('user', 'admin') DEFAULT 'user' NOT NULL,
    \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL,
    \`lastSignedIn\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS \`bookings\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`customerName\` VARCHAR(255) NOT NULL,
    \`customerEmail\` VARCHAR(320) NOT NULL,
    \`customerPhone\` VARCHAR(32) NOT NULL,
    \`serviceType\` ENUM('standard', 'courier', 'airport', 'executive') NOT NULL,
    \`pickupAddress\` TEXT NOT NULL,
    \`destinationAddress\` TEXT NOT NULL,
    \`pickupDate\` VARCHAR(32) NOT NULL,
    \`pickupTime\` VARCHAR(16) NOT NULL,
    \`passengers\` INT DEFAULT 1 NOT NULL,
    \`specialRequests\` TEXT,
    \`estimatedPrice\` INT,
    \`status\` ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending' NOT NULL,
    \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS \`driver_applications\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`fullName\` VARCHAR(255) NOT NULL,
    \`email\` VARCHAR(320) NOT NULL,
    \`phone\` VARCHAR(32) NOT NULL,
    \`licenseNumber\` VARCHAR(64) NOT NULL,
    \`yearsExperience\` INT NOT NULL,
    \`vehicleOwner\` BOOLEAN DEFAULT FALSE NOT NULL,
    \`vehicleType\` VARCHAR(128),
    \`availability\` ENUM('fulltime', 'parttime', 'weekends') NOT NULL,
    \`message\` TEXT,
    \`internalNotes\` TEXT,
    \`assignedTo\` VARCHAR(255),
    \`status\` ENUM('pending', 'reviewing', 'approved', 'rejected') DEFAULT 'pending' NOT NULL,
    \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS \`corporate_inquiries\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`companyName\` VARCHAR(255) NOT NULL,
    \`contactName\` VARCHAR(255) NOT NULL,
    \`email\` VARCHAR(320) NOT NULL,
    \`phone\` VARCHAR(32) NOT NULL,
    \`estimatedMonthlyTrips\` VARCHAR(64),
    \`requirements\` TEXT,
    \`internalNotes\` TEXT,
    \`assignedTo\` VARCHAR(255),
    \`status\` ENUM('pending', 'contacted', 'converted', 'declined') DEFAULT 'pending' NOT NULL,
    \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS \`contact_messages\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`name\` VARCHAR(255) NOT NULL,
    \`email\` VARCHAR(320) NOT NULL,
    \`phone\` VARCHAR(32),
    \`subject\` VARCHAR(255) NOT NULL,
    \`message\` TEXT NOT NULL,
    \`internalNotes\` TEXT,
    \`assignedTo\` VARCHAR(255),
    \`isRead\` BOOLEAN DEFAULT FALSE NOT NULL,
    \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS \`site_content\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`sectionKey\` VARCHAR(128) NOT NULL UNIQUE,
    \`title\` TEXT,
    \`subtitle\` TEXT,
    \`description\` TEXT,
    \`buttonText\` VARCHAR(128),
    \`buttonLink\` VARCHAR(255),
    \`extraData\` TEXT,
    \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
  )`,
  
  `CREATE TABLE IF NOT EXISTS \`site_images\` (
    \`id\` INT AUTO_INCREMENT PRIMARY KEY,
    \`imageKey\` VARCHAR(128) NOT NULL UNIQUE,
    \`url\` TEXT NOT NULL,
    \`altText\` VARCHAR(255),
    \`caption\` TEXT,
    \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
  )`
];

async function migrate() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Starting migration...');
  
  for (const sql of SQL_COMMANDS) {
    await connection.execute(sql);
  }
  
  console.log('✅ Migration completed successfully!');
  await connection.end();
}

migrate().catch(console.error);
