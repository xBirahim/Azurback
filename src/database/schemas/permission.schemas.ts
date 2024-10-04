import { pgTable, foreignKey, integer, serial, varchar, timestamp, boolean, unique } from "drizzle-orm/pg-core";
import { User } from "./user.schemas";
import { ProfilePermission } from "./profilePermission.schemas";
import { status } from "../enums/status.schemas";
import { relations, sql } from "drizzle-orm";

export const Permission = pgTable(
    "Permission",
    {
        id: serial("id").primaryKey().notNull(),
        code: varchar("code"),
        labelEn: varchar("label_en"),
        labelFr: varchar("label_fr"),
        description: varchar("description"),
        admin: boolean("admin"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        status: status("status").default("ini"),
    },
    (table) => {
        return {
            permissionCreatorFkey: foreignKey({
                columns: [table.creator],
                foreignColumns: [User.id],
                name: "Permission_creator_fkey",
            }),
            permissionCodeKey: unique("Permission_code_key").on(table.code),
        };
    }
);

export const PermissionRelations = relations(Permission, ({ one, many }) => ({
    user: one(User, {
        fields: [Permission.creator],
        references: [User.id],
    }),
    profilePermissions: many(ProfilePermission),
}));
