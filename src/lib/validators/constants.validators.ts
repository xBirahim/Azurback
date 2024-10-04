import { z } from "zod";
import Status from "../constants/Status";
import Progress from "../constants/Progress";
import Permission from "../constants/Permission";

export const StatusValidator = z.nativeEnum(Status);
export const ProgressValidator = z.nativeEnum(Progress);
export const PermissionValidator = z.nativeEnum(Permission);
