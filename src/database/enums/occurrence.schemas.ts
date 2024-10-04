import { pgEnum } from "drizzle-orm/pg-core";

export const occurrence = pgEnum("occurrence", ["non", "dly", "wly", "bmi", "mth", "bim", "tri", "smi", "yly"]);
