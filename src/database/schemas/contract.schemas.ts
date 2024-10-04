import { relations, sql } from "drizzle-orm";
import { pgTable, integer, bigint, boolean, foreignKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { User } from "./user.schemas";
import { Client } from "./client.schemas";
import { Service } from "./service.schemas";
import { ContractHistory } from "./contractHistory.schemas";
import { status } from "../enums/status.schemas";
import { ServiceHistory } from "./serviceHistory.schemas";

export const Contract = pgTable(
    "Contract",
    {
        id: serial("id").primaryKey().notNull(),
        clientId: integer("client_id").notNull(),
        label: varchar("label"),
        description: varchar("description"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        lastmodified: timestamp("lastmodified", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        private: boolean("private").default(false).notNull(),
        status: status("status").default("ini"),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        dateDebut: bigint("date_debut", { mode: "number" }),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        dateFin: bigint("date_fin", { mode: "number" }),
    },
    (table) => {
        return {
            contractClientIdFkey: foreignKey({
                columns: [table.clientId],
                foreignColumns: [Client.id],
                name: "Contract_clientId_fkey",
            }),
            contractCreatorFkey: foreignKey({
                columns: [table.creator],
                foreignColumns: [User.id],
                name: "Contract_creator_fkey",
            }),
        };
    }
);

export const ContractRelations = relations(Contract, ({ one, many }) => ({
    client: one(Client, {
        fields: [Contract.clientId],
        references: [Client.id],
    }),
    user: one(User, {
        fields: [Contract.creator],
        references: [User.id],
    }),
    services: many(Service),
    contractHistories: many(ContractHistory),
    serviceHistories: many(ServiceHistory),
}));
