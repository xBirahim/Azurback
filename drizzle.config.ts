import { defineConfig } from "drizzle-kit";
import Env from "./src/config/env.config";

export default defineConfig({
    schema: "./src/schemas/*.schemas.ts",
    dialect: "postgresql",
    out: "./migrations",
    migrations: {
        prefix: "supabase",
    },
    dbCredentials: {
        user: Env.DB_USERNAME,
        password: Env.DB_PASSWORD,
        host: Env.DB_HOSTNAME,
        port: Env.DB_PORT,
        database: Env.DB_NAME,
        ssl: Env.DB_SSL,
    },
});
