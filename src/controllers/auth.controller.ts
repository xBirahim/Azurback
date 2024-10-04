import { NextFunction, Request, Response } from "express";
import { setCookie, removeCookie } from "../lib/helpers/cookie.helper";
import { createErrorResponse, createSuccessResponse } from "../lib/helpers/response.helper";
import { AuthenticationManager } from "../core/authentication";
import { SignInBodyValidator, SignUpBodyValidator } from "../lib/validators";
import { createError } from "../lib/errors/app.error";
import { Logger } from "../core/logger";
import { decodeToken } from "../lib/helpers/token.helper";
import { AccessTokenPayload } from "../lib/constants/AccessTokenPayload";
import { db } from "../database/db";
import { Permission, Profile, ProfilePermission, User, UserProfile } from "../database/schemas";
import { eq } from "drizzle-orm";
import { AccessTokenKey, RefreshTokenKey } from "../lib/constants/TokenKeys";

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = SignInBodyValidator.parse(req.body);
        const data = await AuthenticationManager.login(userData.email, userData.password);

        // res.setHeader("Set-Cookie", [
        //     `${AccessTokenKey}=${data.session.access_token}; Path=/; Secure; HttpOnly; SameSite=None; Max-Age=${data.session.expires_at}`,
        //     `${RefreshTokenKey}=${data.session.refresh_token}; Path=/; Secure; HttpOnly;`,
        // ]);

        res.cookie(AccessTokenKey, data.session.access_token, {
            secure: true,
            sameSite: "none",
            maxAge: data.session.expires_at,
        });

        res.cookie(RefreshTokenKey, data.session.refresh_token, {
            secure: true,
        });

        // setCookie(res, AccessTokenKey, data.session.access_token, {
        //     secure: true, //process.env.NODE_ENV === "production",
        //     sameSite: "none",
        //     maxAge: data.session.expires_at,
        // });

        // setCookie(res, RefreshTokenKey, data.session.refresh_token, {
        //     // secure: true, //process.env.NODE_ENV === "production",
        // });

        // return sendSuccessResponse(res, {
        //     status: 200,
        //     message: "Logged in successfully",
        //     data: {
        //         user: data.session.user.user_metadata,
        //         session: data.session,
        //     },
        // });

        return res.status(200).json({
            user: data.session.user.user_metadata,
            session: data.session,
        });
    } catch (error) {
        next(error);
    }
};

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const userData = SignUpBodyValidator.parse(req.body);

    try {
        const data = await AuthenticationManager.register(userData.email, userData.password, {
            firstname: userData.firstname,
            lastname: userData.lastname,
            isAdmin: userData.isAdmin,
        });

        if (!data.session) {
            throw createError({ message: "Registration failed", code: 400 });
        }

        setCookie(res, AccessTokenKey, data.session.access_token, {
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: data.session.expires_at,
        });

        setCookie(res, RefreshTokenKey, data.session.refresh_token, {
            secure: process.env.NODE_ENV === "production",
        });

        return createSuccessResponse(res, {
            status: 200,
            message: "Logged in successfully",
            data: {
                user: data.session.user.user_metadata,
                session: data.session,
            },
        });

        // return res.status(200).json({
        //     user: data.session.user.user_metadata,
        //     session: data.session,
        // });
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string = req.cookies[AccessTokenKey];
    const refreshToken: string = req.cookies[RefreshTokenKey];

    try {
        await AuthenticationManager.logout(accessToken);

        removeCookie(res, accessToken);
        removeCookie(res, refreshToken);

        return createSuccessResponse(res, {
            status: 200,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};

// export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
//     const { email } = req.body;

//     try {
//         await AuthService.resetPassword(email);

//         return createSuccessResponse(res, {
//             status: 200,
//             message: "Password reset link sent",
//         });
//     } catch (error) {
//         next(error);
//     }
// }

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string = req.cookies[AccessTokenKey];
    const refreshToken: string = req.cookies[RefreshTokenKey];

    try {
        const data = await AuthenticationManager.refreshToken(refreshToken!);

        if (!data || !data.session) {
            throw createError({ message: "Failed to refresh token", code: 400 });
        }

        setCookie(res, AccessTokenKey, data.session.access_token, {
            // secure: true, //process.env.NODE_ENV === "production",
            // sameSite: "none",
            maxAge: data.session.expires_at,
        });

        setCookie(res, RefreshTokenKey, data.session.refresh_token, {
            // secure: true, //process.env.NODE_ENV === "production",
            // sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // return sendSuccessResponse(res, {
        //     status: 200,
        //     message: "Token refreshed",
        //     data: {
        //         user: data.user,
        //     },
        // });

        return res.status(200).json({
            user: data.user,
        });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string = req.cookies[AccessTokenKey];

    // [ ] Handle the case where the token is not present in the middleware
    if (!accessToken) {
        return createErrorResponse(res, {
            status: 401,
            message: "Unauthorized",
            metadata: req.cookies,
        });
    }

    try {
        const payload = decodeToken(accessToken) as AccessTokenPayload;

        const uuid = payload.user_metadata.sub;

        const user = await db.select().from(User).where(eq(User.uuid, uuid)).limit(1);

        const permissions = await db
            .select({ code: Permission.code })
            .from(Permission)
            .innerJoin(ProfilePermission, eq(Permission.id, ProfilePermission.permissionId))
            .innerJoin(Profile, eq(ProfilePermission.profileId, Profile.id))
            .innerJoin(UserProfile, eq(Profile.id, UserProfile.profileId))
            .innerJoin(User, eq(UserProfile.userId, User.id))
            .where(eq(User.uuid, uuid));

        // return sendSuccessResponse(res, {
        //     status: 200,
        //     message: "User found",
        //     data: {
        //         user: data,
        //     },
        // });

        return createSuccessResponse(res, { status: 200, message: "User found", data: { user, permissions } });
    } catch (error) {
        next(error);
    }
};
