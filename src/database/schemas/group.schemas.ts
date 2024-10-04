import { pgTable, foreignKey, integer, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { User } from "./user.schemas";
import { UserGroup } from "./userGroup.schemas";
import { status } from "../enums/status.schemas";
import { relations, sql } from "drizzle-orm";

export const Group = pgTable(
    "Group",
    {
        id: serial("id").primaryKey().notNull(),
        description: varchar("description"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        label: varchar("label"),
        status: status("status").default("ini"),
    },
    (table) => {
        return {
            groupCreatorFkey: foreignKey({
                columns: [table.creator],
                foreignColumns: [User.id],
                name: "Group_creator_fkey",
            }),
        };
    }
);

export const GroupRelations = relations(Group, ({ one, many }) => ({
    user: one(User, {
        fields: [Group.creator],
        references: [User.id],
    }),
    userGroups: many(UserGroup),
}));
