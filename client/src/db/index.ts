/**
 * CLIENT-SIDE DB PLACEHOLDER
 *
 * ❌ No drizzle
 * ❌ No mysql
 * ❌ No schema imports
 *
 * The client NEVER talks directly to the database.
 * All data access happens via:
 *   - tRPC
 *   - REST APIs
 */

export type ClientDB = never;

/**
 * This file exists only to prevent accidental DB usage
 * in the browser and to keep imports explicit.
 */
export const db = null as unknown as ClientDB;
