import { pgTable, foreignKey, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { User } from "./user.schemas";
import { Profile } from "./profile.schemas";
import { status } from "../enums/status.schemas";

export const UserProfile = pgTable(
    "UserProfile",
    {
        userId: integer("user_id").notNull(),
        profileId: integer("profile_id").notNull(),
        grantedBy: integer("granted_by"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        status: status("status").default("ini"),
    },
    (table) => {
        return {
            userProfileGrantedByFkey: foreignKey({
                columns: [table.grantedBy],
                foreignColumns: [User.id],
                name: "UserProfile_grantedBy_fkey",
            }),
            userProfileProfileIdFkey: foreignKey({
                columns: [table.profileId],
                foreignColumns: [Profile.id],
                name: "UserProfile_profileId_fkey",
            }),
            userProfileUserIdFkey: foreignKey({
                columns: [table.userId],
                foreignColumns: [User.id],
                name: "UserProfile_userId_fkey",
            }),
            userProfilePkey: primaryKey({ columns: [table.userId, table.profileId], name: "UserProfile_pkey" }),
        };
    }
);

export const UserProfileRelations = relations(UserProfile, ({ one }) => ({
    user_grantedBy: one(User, {
        fields: [UserProfile.grantedBy],
        references: [User.id],
        relationName: "userProfile_grantedBy_user_id",
    }),
    profile: one(Profile, {
        fields: [UserProfile.profileId],
        references: [Profile.id],
    }),
    user_userId: one(User, {
        fields: [UserProfile.userId],
        references: [User.id],
        relationName: "userProfile_userId_user_id",
    }),
}));
