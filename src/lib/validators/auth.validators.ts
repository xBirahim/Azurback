import { z } from "zod";
import {
    UserEmailValidator,
    UserFirstnameValidator,
    UserIsadminValidator,
    UserLastnameValidator,
    UserPasswordValidator,
} from "./database/user.validators";



// #region request body validators
export const SignInBodyValidator = z.object({
    email: UserEmailValidator,
    password: UserPasswordValidator,
});

export const SignUpBodyValidator = z.object({
    email: UserEmailValidator,
    password: UserPasswordValidator,
    firstname: UserFirstnameValidator,
    lastname: UserLastnameValidator,
    isAdmin: UserIsadminValidator.default(false),
});

export const RefreshTokenBodyValidator = z.object({
    refreshToken: z.string(),
});

// #endregion
