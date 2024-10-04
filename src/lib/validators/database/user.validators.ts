import { z } from "zod";
import { StatusValidator } from "../constants.validators";
import Status from "../../constants/Status";

export const UserIdValidator = z.number().int().nonnegative();
export const UserEmailValidator = z.string().email();
export const UserPasswordValidator = z.string();
export const UserUuidValidator = z.string().uuid();
export const UserFirstnameValidator = z.string();
export const UserLastnameValidator = z.string();
export const UserCreatorValidator = z.number().int();
export const UserCreatedValidator = z.string();
export const UserModifiedValidator = z.string();
export const UserStatusValidator = StatusValidator;
export const UserIsadminValidator = z.boolean().default(false);

export const UserValidator = z.object({
    id: UserIdValidator,
    uuid: UserUuidValidator,
    firstname: UserFirstnameValidator.optional(),
    lastname: UserLastnameValidator.optional(),
    email: UserEmailValidator.optional(),
    creator: UserCreatedValidator.optional(),
    created: UserCreatorValidator.optional(),
    modified: UserModifiedValidator.optional(),
    status: UserStatusValidator.default(Status.ini),
    isadmin: z.boolean().default(false),
});
