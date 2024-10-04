import { pgTable, foreignKey, integer, serial, varchar, timestamp, boolean, unique, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { status } from "../enums/status.schemas";
import { AccessObject } from "./accessObject.schemas";
import { Client } from "./client.schemas";
import { Contract } from "./contract.schemas";
import { ContractHistory } from "./contractHistory.schemas";
import { Group } from "./group.schemas";
import { Permission } from "./permission.schemas";
import { Profile } from "./profile.schemas";
import { ProfilePermission } from "./profilePermission.schemas";
import { Service } from "./service.schemas";
import { ServiceTemplate } from "./serviceTemplate.schemas";
import { Task } from "./task.schemas";
import { UserGroup } from "./userGroup.schemas";
import { UserProfile } from "./userProfile.schemas";

export const User = pgTable(
    "User",
    {
        id: serial("id").primaryKey().notNull(),
        uuid: uuid("uuid").notNull(),
        firstname: varchar("firstname"),
        lastname: varchar("lastname"),
        email: varchar("email"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        modified: timestamp("modified", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        status: status("status").default("ini"),
        isadmin: boolean("isadmin").default(false).notNull(),
    },
    (table) => {
        return {
            userCreatorFkey: foreignKey({
                columns: [table.creator],
                foreignColumns: [table.id],
                name: "User_creator_fkey",
            }),
            userUuidUnique: unique("user_uuid_unique").on(table.uuid),
            userEmailKey: unique("User_email_key").on(table.email),
        };
    }
);

export const userRelations = relations(User, ({ one, many }) => ({
    accessObjects_idUser: many(AccessObject, {
        relationName: "accessObject_idUser_user_id",
    }),
    contracts: many(Contract),
    groups: many(Group),
    permissions: many(Permission),
    services: many(Service),
    serviceTemplates: many(ServiceTemplate),
    tasks: many(Task),
    user: one(User, {
        fields: [User.creator],
        references: [User.id],
        relationName: "user_creator_user_id",
    }),
    users: many(User, {
        relationName: "user_creator_user_id",
    }),
    clients: many(Client),
    contractHistories: many(ContractHistory),
    profiles: many(Profile),
    userGroups_grantedBy: many(UserGroup, {
        relationName: "userGroup_grantedBy_user_id",
    }),
    userGroups_userId: many(UserGroup, {
        relationName: "userGroup_userId_user_id",
    }),
    userProfiles_grantedBy: many(UserProfile, {
        relationName: "userProfile_grantedBy_user_id",
    }),
    userProfiles_userId: many(UserProfile, {
        relationName: "userProfile_userId_user_id",
    }),
    profilePermissions: many(ProfilePermission),
}));
