import { pgTable, integer, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { Task } from "./task.schemas";

export const TaskDependencies = pgTable(
    "TaskDependencies",
    {
        taskId: integer("task_id").notNull(),
        dependsOn: integer("depends_on").notNull(),
    },
    (table) => {
        return {
            taskDependenciesDependsOnFkey: foreignKey({
                columns: [table.dependsOn],
                foreignColumns: [Task.id],
                name: "TaskDependencies_depends_on_fkey",
            }).onDelete("cascade"),
            taskDependenciesTaskIdFkey: foreignKey({
                columns: [table.taskId],
                foreignColumns: [Task.id],
                name: "TaskDependencies_task_id_fkey",
            }).onDelete("cascade"),
            taskDependenciesPkey: primaryKey({
                columns: [table.taskId, table.dependsOn],
                name: "TaskDependencies_pkey",
            }),
        };
    }
);

export const TaskDependenciesRelations = relations(TaskDependencies, ({ one }) => ({
    task_dependsOn: one(Task, {
        fields: [TaskDependencies.dependsOn],
        references: [Task.id],
        relationName: "taskDependencies_dependsOn_task_id",
    }),
    task_taskId: one(Task, {
        fields: [TaskDependencies.taskId],
        references: [Task.id],
        relationName: "taskDependencies_taskId_task_id",
    }),
}));
