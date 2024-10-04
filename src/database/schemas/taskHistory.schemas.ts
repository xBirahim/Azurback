import { pgTable, integer, boolean, foreignKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { Service } from "./service.schemas";
import { Task } from "./task.schemas";
import { progress } from "../enums/progress.schemas";
import { status } from "../enums/status.schemas";

export const TaskHistory = pgTable(
    "TaskHistory",
    {
        id: serial("id").primaryKey().notNull(),
        taskId: integer("task_id").notNull(),
        serviceId: integer("service_id").notNull(),
        label: varchar("label"),
        description: varchar("description"),
        creator: integer("creator"),
        created: timestamp("created", { mode: "string" }),
        lastmodified: timestamp("lastmodified", { mode: "string" }),
        private: boolean("private"),
        progress: progress("progress"),
        status: status("status"),
        changeDate: timestamp("change_date", { mode: "string" })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => {
        return {
            taskhistoryServiceidFkey: foreignKey({
                columns: [table.serviceId],
                foreignColumns: [Service.id],
                name: "taskhistory_serviceid_fkey",
            }),
            taskhistoryTaskidFkey: foreignKey({
                columns: [table.taskId],
                foreignColumns: [Task.id],
                name: "taskhistory_taskid_fkey",
            }),
        };
    }
);

export const TaskHistoryRelations = relations(TaskHistory, ({ one }) => ({
    service: one(Service, {
        fields: [TaskHistory.serviceId],
        references: [Service.id],
    }),
    task: one(Task, {
        fields: [TaskHistory.taskId],
        references: [Task.id],
    }),
}));
