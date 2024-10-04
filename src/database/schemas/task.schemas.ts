import { pgTable, integer, bigint, boolean, foreignKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { User } from "./user.schemas";
import { Service } from "./service.schemas";
import { TaskHistory } from "./taskHistory.schemas";
import { TaskDependencies } from "./taskDependencies.schemas";
import { status } from "../enums/status.schemas";
import { progress } from "../enums/progress.schemas";

export const Task = pgTable(
    "Task",
    {
        id: serial("id").primaryKey().notNull(),
        serviceId: integer("service_id").notNull(),
        label: varchar("label"),
        description: varchar("description"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        lastmodified: timestamp("lastmodified", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
        private: boolean("private").default(false).notNull(),
        progress: progress("progress").default("nst").notNull(),
        status: status("status").default("ini"),
    },
    (table) => {
        return {
            taskCreatorFkey: foreignKey({
                columns: [table.creator],
                foreignColumns: [User.id],
                name: "Task_creator_fkey",
            }),
            taskServiceIdFkey: foreignKey({
                columns: [table.serviceId],
                foreignColumns: [Service.id],
                name: "Task_serviceId_fkey",
            }),
        };
    }
);

export const TaskRelations = relations(Task, ({ one, many }) => ({
    taskHistories: many(TaskHistory),
    user: one(User, {
        fields: [Task.creator],
        references: [User.id],
    }),
    service: one(Service, {
        fields: [Task.serviceId],
        references: [Service.id],
    }),
    taskDependencies_dependsOn: many(TaskDependencies, {
        relationName: "taskDependencies_dependsOn_task_id",
    }),
    taskDependencies_taskId: many(TaskDependencies, {
        relationName: "taskDependencies_taskId_task_id",
    }),
}));
