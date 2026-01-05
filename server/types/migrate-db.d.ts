declare module "../migrate-db.js" {
  export function runMigrations(): Promise<void>;
}