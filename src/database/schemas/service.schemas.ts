import { pgTable, integer, bigint, boolean, foreignKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { User } from "./user.schemas";
import { Contract } from "./contract.schemas";
import { TaskHistory } from "./taskHistory.schemas";
import { Task } from "./task.schemas";
import { ServiceHistory } from "./serviceHistory.schemas";
import { status } from "../enums/status.schemas";

export const Service = pgTable(
    "Service",
    {
        id: serial("id").primaryKey().notNull(),
        contractId: integer("contract_id").notNull(),
        label: varchar("label"),
        description: varchar("description"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        lastmodified: timestamp("lastmodified", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        private: boolean("private").default(false).notNull(),
        status: status("status").default("ini"),
    },
    (table) => {
        return {
            serviceContractIdFkey: foreignKey({
                columns: [table.contractId],
                foreignColumns: [Contract.id],
                name: "Service_contractId_fkey",
            }),
            serviceCreatorFkey: foreignKey({
                columns: [table.creator],
                foreignColumns: [User.id],
                name: "Service_creator_fkey",
            }),
        };
    }
);

export const ServiceRelations = relations(Service, ({ one, many }) => ({
    contract: one(Contract, {
        fields: [Service.contractId],
        references: [Contract.id],
    }),
    user: one(User, {
        fields: [Service.creator],
        references: [User.id],
    }),
    taskHistories: many(TaskHistory),
    tasks: many(Task),
    serviceHistories: many(ServiceHistory),
}));
