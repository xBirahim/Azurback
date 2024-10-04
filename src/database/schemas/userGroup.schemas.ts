import { pgTable, foreignKey, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { User } from "./user.schemas";
import { Group } from "./group.schemas";
import { status } from "../enums/status.schemas";
import { relations, sql } from "drizzle-orm";

export const UserGroup = pgTable(
    "UserGroup",
    {
        userId: integer("user_id").notNull(),
        groupId: integer("group_id").notNull(),
        grantedBy: integer("granted_by"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        status: status("status").default("ini"),
    },
    (table) => {
        return {
            userGroupGrantedByFkey: foreignKey({
                columns: [table.grantedBy],
                foreignColumns: [User.id],
                name: "UserGroup_grantedBy_fkey",
            }),
            userGroupGroupFkey: foreignKey({
                columns: [table.groupId],
                foreignColumns: [Group.id],
                name: "UserGroup_group_fkey",
            }),
            userGroupUserIdFkey: foreignKey({
                columns: [table.userId],
                foreignColumns: [User.id],
                name: "UserGroup_userId_fkey",
            }),
            userGroupPkey: primaryKey({ columns: [table.userId, table.groupId], name: "UserGroup_pkey" }),
        };
    }
);

export const UserGroupRelations = relations(UserGroup, ({ one }) => ({
    user_grantedBy: one(User, {
        fields: [UserGroup.grantedBy],
        references: [User.id],
        relationName: "userGroup_grantedBy_user_id",
    }),
    group: one(Group, {
        fields: [UserGroup.groupId],
        references: [Group.id],
    }),
    user_userId: one(User, {
        fields: [UserGroup.userId],
        references: [User.id],
        relationName: "userGroup_userId_user_id",
    }),
}));
