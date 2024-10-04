import { pgTable, integer, bigint, boolean, foreignKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { status } from "../enums/status.schemas";

export const ClientHistory = pgTable("ClientHistory", {
    id: serial("id").primaryKey().notNull(),
    clientId: integer("client_id").notNull(),
    label: varchar("label"),
    description: varchar("description"),
    creator: integer("creator"),
    status: status("status"),
    changeDate: timestamp("change_date", { mode: "string" })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});
