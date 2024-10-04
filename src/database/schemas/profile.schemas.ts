import { pgTable, foreignKey, integer, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { User } from "./user.schemas";
import { UserProfile } from "./userProfile.schemas";
import { ProfilePermission } from "./profilePermission.schemas";
import { status } from "../enums/status.schemas";
import { relations, sql } from "drizzle-orm";

export const Profile = pgTable(
    "Profile",
    {
        id: serial("id").primaryKey().notNull(),
        code: varchar("code"),
        description: varchar("description"),
        labelEn: varchar("label_en"),
        labelFr: varchar("label_fr"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        status: status("status").default("ini"),
    },
    (table) => {
        return {
            profileCreatorFkey: foreignKey({
                columns: [table.creator],
                foreignColumns: [User.id],
                name: "Profile_creator_fkey",
            }),
        };
    }
);

export const ProfileRelations = relations(Profile, ({ one, many }) => ({
    user: one(User, {
        fields: [Profile.creator],
        references: [User.id],
    }),
    userProfiles: many(UserProfile),
    profilePermissions: many(ProfilePermission),
}));
