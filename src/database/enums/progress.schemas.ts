import { pgEnum } from "drizzle-orm/pg-core";

export const progress = pgEnum("progress", ["nst", "wip", "ohd", "cmp", "dfd", "cnl"]);
