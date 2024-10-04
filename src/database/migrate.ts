import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import Env from "../config/env.config";
import { Logger } from "../core/logger";

const migrationClient = postgres(Env.DB_CONNECTION_STRING, { max: 1 });
const db: PostgresJsDatabase = drizzle(migrationClient);

const main = async () => {
    try {
        Logger.Info("Migrating database...");
        await migrate(db, { migrationsFolder: "./migrations" });
        await migrationClient.end();
        Logger.Info("Database migrated successfully!");
    } catch (error) {
        Logger.Error("Error migrating database", { error: error });
    }
};

main();
