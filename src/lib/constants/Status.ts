import z from "zod";
import { status } from "../../database/schemas";

const StatusEnumSchema = z.enum(status.enumValues);
const Status = StatusEnumSchema.Enum;

// enum Status {
//     Initialized = "ini",
//     Validated = "val",
//     Deleted = "del",
//     Archived = "arc",
// }

export default Status;
