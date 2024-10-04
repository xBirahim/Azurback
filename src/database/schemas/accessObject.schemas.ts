import { pgTable, integer, bigint, text, foreignKey, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { User } from "./user.schemas";

export const AccessObject = pgTable(
    "AccessObject",
    {
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        id: bigint("id", { mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
            name: "Rule_id_seq",
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
        }),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        idObject: bigint("id_object", { mode: "number" }).notNull(),
        idUser: integer("id_user").notNull(),
        objectType: text("object_type").notNull(),
    },
    (table) => {
        return {
            accessObjectIdUserFkey: foreignKey({
                columns: [table.idUser],
                foreignColumns: [User.id],
                name: "AccessObject_id_user_fkey",
            }),
            ruleUserIdFkey: foreignKey({
                columns: [table.idUser],
                foreignColumns: [User.id],
                name: "Rule_user_id_fkey",
            }),
        };
    }
);
