import { pgTable, foreignKey, integer, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { Contract } from "./contract.schemas";
import { ContractHistory } from "./contractHistory.schemas";
import { User } from "./user.schemas";
import { status } from "../enums/status.schemas";
import { relations, sql } from "drizzle-orm";

export const Client = pgTable(
    "Client",
    {
        id: serial("id").primaryKey().notNull(),
        label: varchar("label"),
        description: varchar("description"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        lastmodified: timestamp("lastmodified", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        status: status("status").default("ini"),
    },
    (table) => {
        return {
            clientCreatorFkey: foreignKey({
                columns: [table.creator],
                foreignColumns: [User.id],
                name: "Client_creator_fkey",
            }),
        };
    }
);

export const ClientRelations = relations(Client, ({ one, many }) => ({
    contracts: many(Contract),
    user: one(User, {
        fields: [Client.creator],
        references: [User.id],
    }),
    contractHistories: many(ContractHistory),
}));

export type ClientColumnKeys = keyof typeof Client.$inferSelect;
