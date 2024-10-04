import { pgTable, text, serial, timestamp, unique } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const ExpiredToken = pgTable(
    "ExpiredToken",
    {
        id: serial("id").primaryKey().notNull(),
        token: text("token").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    },
    (table) => {
        return {
            expiredTokenTokenKey: unique("expired_token_token_key").on(table.token),
        };
    }
);
