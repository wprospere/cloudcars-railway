import { mysqlTable, varchar, datetime, mysqlEnum } from "drizzle-orm/mysql-core";

export const adminUsers = mysqlTable("admin_users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["admin", "staff"]).notNull().default("admin"),
  createdAt: datetime("created_at").notNull(),
});
