import { pgTable, integer, boolean, foreignKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { User } from "./user.schemas";
import { Client } from "./client.schemas";
import { Contract } from "./contract.schemas";
import { status } from "../enums/status.schemas";

export const ContractHistory = pgTable(
    "ContractHistory",
    {
        id: serial("id").primaryKey().notNull(),
        contractId: integer("contract_id").notNull(),
        clientId: integer("client_id").notNull(),
        label: varchar("label"),
        description: varchar("description"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }),
        lastmodified: timestamp("lastmodified", { mode: "string" }),
        private: boolean("private"),
        status: status("status"),
        changeDate: timestamp("change_date", { mode: "string" })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => {
        return {
            contractHistoryCreatorFkey: foreignKey({
                columns: [table.creator],
                foreignColumns: [User.id],
                name: "ContractHistory_creator_fkey",
            }),
            contracthistoryClientidFkey: foreignKey({
                columns: [table.clientId],
                foreignColumns: [Client.id],
                name: "contracthistory_clientid_fkey",
            }),
            contracthistoryContractidFkey: foreignKey({
                columns: [table.contractId],
                foreignColumns: [Contract.id],
                name: "contracthistory_contractid_fkey",
            }),
        };
    }
);

export const ContractHistoryRelations = relations(ContractHistory, ({ one }) => ({
    user: one(User, {
        fields: [ContractHistory.creator],
        references: [User.id],
    }),
    client: one(Client, {
        fields: [ContractHistory.clientId],
        references: [Client.id],
    }),
    contract: one(Contract, {
        fields: [ContractHistory.contractId],
        references: [Contract.id],
    }),
}));
