import { pgTable, integer, bigint, foreignKey, timestamp, varchar, jsonb, text } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { User } from "./user.schemas";
import { status } from "../enums/status.schemas";

export const ServiceTemplate = pgTable(
    "ServiceTemplate",
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
            name: "ServiceTemplate_id_seq",
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
        }),
        label: text("label").notNull(),
        tasks: jsonb("tasks").array().notNull(),
        description: varchar("description"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        lastmodified: timestamp("lastmodified", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        status: status("status").default("val"),
    },
    (table) => {
        return {
            servicetemplateUserFk: foreignKey({
                columns: [table.creator],
                foreignColumns: [User.id],
                name: "servicetemplate_user_fk",
            }),
        };
    }
);

export const ServiceTemplateRelations = relations(ServiceTemplate, ({ one }) => ({
    user: one(User, {
        fields: [ServiceTemplate.creator],
        references: [User.id],
    }),
}));
