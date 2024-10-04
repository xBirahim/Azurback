import { pgTable, foreignKey, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { User } from "./user.schemas";
import { Permission } from "./permission.schemas";
import { Profile } from "./profile.schemas";
import { status } from "../enums/status.schemas";

import { relations, sql } from "drizzle-orm";

export const ProfilePermission = pgTable(
    "ProfilePermission",
    {
        profileId: integer("profile_id").notNull(),
        permissionId: integer("permission_id").notNull(),
        grantedBy: integer("granted_by"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        status: status("status").default("ini"),
    },
    (table) => {
        return {
            profilePermissionGrantedByFkey: foreignKey({
                columns: [table.grantedBy],
                foreignColumns: [User.id],
                name: "ProfilePermission_grantedBy_fkey",
            }),
            profilePermissionPermissionIdFkey: foreignKey({
                columns: [table.permissionId],
                foreignColumns: [Permission.id],
                name: "ProfilePermission_permissionId_fkey",
            }),
            profilePermissionProfileIdFkey: foreignKey({
                columns: [table.profileId],
                foreignColumns: [Profile.id],
                name: "ProfilePermission_profileId_fkey",
            }),
            profilePermissionPkey: primaryKey({
                columns: [table.profileId, table.permissionId],
                name: "ProfilePermission_pkey",
            }),
        };
    }
);

export const ProfilePermissionRelations = relations(ProfilePermission, ({ one }) => ({
    user: one(User, {
        fields: [ProfilePermission.grantedBy],
        references: [User.id],
    }),
    permission: one(Permission, {
        fields: [ProfilePermission.permissionId],
        references: [Permission.id],
    }),
    profile: one(Profile, {
        fields: [ProfilePermission.profileId],
        references: [Profile.id],
    }),
}));
