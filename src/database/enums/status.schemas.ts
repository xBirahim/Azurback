import { z } from "zod";
import { pgEnum } from "drizzle-orm/pg-core";

export const status = pgEnum("status", ["ini", "val", "del", "arc"]);

const StatusEnumSchema = z.enum(status.enumValues);
export const Status = StatusEnumSchema.Enum;
