import { pgTable, integer, boolean, foreignKey, serial, timestamp, varchar, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { Service } from "./service.schemas";
import { Contract } from "./contract.schemas";
import { status } from "../enums/status.schemas";

export const ServiceHistory = pgTable(
    "ServiceHistory",
    {
        id: serial("id").primaryKey().notNull(),
        serviceId: integer("service_id").notNull(),
        contractId: integer("contract_id").notNull(),
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
        changedBy: uuid("changed_by"),
    },
    (table) => {
        return {
            servicehistoryContractidFkey: foreignKey({
                columns: [table.contractId],
                foreignColumns: [Contract.id],
                name: "servicehistory_contractid_fkey",
            }),
            servicehistoryServiceidFkey: foreignKey({
                columns: [table.serviceId],
                foreignColumns: [Service.id],
                name: "servicehistory_serviceid_fkey",
            }),
        };
    }
);

export const ServiceHistoryRelations = relations(ServiceHistory, ({ one }) => ({
    contract: one(Contract, {
        fields: [ServiceHistory.contractId],
        references: [Contract.id],
    }),
    service: one(Service, {
        fields: [ServiceHistory.serviceId],
        references: [Service.id],
    }),
}));
