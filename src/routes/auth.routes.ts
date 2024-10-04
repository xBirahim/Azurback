import express from "express";
import { signIn, signUp, signOut, refreshToken, getUser } from "../controllers/auth.controller";
import {
    RefreshTokenBodyValidator,
    SignInBodyValidator,
    SignUpBodyValidator,
    UserEmailValidator,
    UserPasswordValidator,
} from "../lib/validators";
import { hasBodyFields } from "../middlewares/hasBodyFields";
import { validateBody, validateCookies } from "../middlewares/validations";
import { validateToken } from "../lib/helpers/token.helper";
import Env from "../config/env.config";
import { RefreshTokenKey } from "../lib/constants/TokenKeys";
import { hasCookies } from "../middlewares/hasCookies";

const authRoutes = express.Router();

authRoutes.post(
    "/signup",
    hasBodyFields(
        {
            name: "email",
            required: true,
            customValidator: (value) => {
                return UserEmailValidator.safeParse(value).success;
            },
        },
        {
            name: "password",
            required: true,
            customValidator: (value) => {
                return UserPasswordValidator.safeParse(value).success;
            },
        }
    ),
    signUp
);
authRoutes.post(
    "/signin",
    hasBodyFields(
        {
            name: "email",
            required: true,
            customValidator: (value) => {
                return UserEmailValidator.safeParse(value).success;
            },
        },
        {
            name: "password",
            required: true,
            customValidator: (value) => {
                return UserPasswordValidator.safeParse(value).success;
            },
        }
    ),
    signIn
);
authRoutes.post(
    "/signout",
    validateCookies({
        "sb-access-token": {
            required: true,
            custom: (token: string) => {
                const { valid } = validateToken(token, Env.SUPABASE_JWT_SECRET, true);
                return valid;
            },
        },
    }),
    signOut
);
authRoutes.post(
    "/refresh",
    ...hasCookies({ name: RefreshTokenKey, required: true }),
    validateBody(RefreshTokenBodyValidator),
    refreshToken
);
authRoutes.get("/me", getUser);

export default authRoutes;
