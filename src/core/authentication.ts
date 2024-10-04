import { eq, and, isNull, DrizzleError } from "drizzle-orm";
import { db } from "../database/db";
import { CacheManager } from "./cache";
import { MailManager, mailService } from "./mail";
import { createError, isAppError } from "../lib/errors/app.error";
import { ExpiredToken, User } from "../database/schemas";
import Env from "../config/env.config";
import { createClient } from "../config/supabase.config";
import { AuthTokenResponse, AuthTokenResponsePassword, isAuthApiError } from "@supabase/supabase-js";
import { Logger } from "./logger";

const accessTokenExpiry = "15m";
const refreshTokenExpiry = "7d";
const SALT_ROUNDS = 10;

export class AuthenticationManager {
    private static authCacheService = new CacheManager();

    public static async register(
        email: string,
        password: string,
        metadata: { firstname: string; lastname: string; isAdmin: boolean }
    ) {
        const supabase = createClient();
        let data, error, provider;

        ({ data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    firstname: metadata.firstname,
                    lastname: metadata.lastname,
                    isAdmin: metadata.isAdmin,
                },
            },
        }));

        if (error) {
            throw createError({ message: "Failed to register user", code: 422 });
        }

        if (data && data.session) {
            Logger.Info("User registered", { email: email });
            return data;
        }

        throw createError({ message: "Registration failed", code: 400 });
    }

    public static async login(email: string, password: string) {
        const supabase = createClient();
        let data, error;

        ({ data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        }));

        if (error) {
            throw createError({ message: "Invalid email or password", code: 401 });
        }

        if (data && data.session) {
            Logger.Info("User logged in", { email: email });
            return data;
        }

        throw createError({ message: "Authentication failed", code: 400 });
    }

    public static async logout(accessToken: string) {
        const supabase = createClient();
        const { error } = await supabase.auth.admin.signOut(accessToken, "local");

        if (error) {
            Logger.Warn("Failed to logout", { token: accessToken, error: error });
            throw error;
        }

        await db.insert(ExpiredToken).values({ token: accessToken }).execute();

        Logger.Info("User logged out", { accessToken: accessToken });
    }

    public static async refreshToken(refreshToken: string) {

        try {
            await db.insert(ExpiredToken).values({ token: refreshToken }).execute();
        } catch (error) {
            if (error instanceof DrizzleError) {
                Logger.Warn("Failed to insert expired refresh token", {
                    refreshToken: refreshToken,
                    error: error,
                });
            } else {
                Logger.Warn("An error occured while inserting a token in database", {
                    refreshToken: refreshToken,
                    error: error,
                });
                throw createError({ message: "Token refresh failed", code: 400 });
            }
        }
        const supabase = createClient();

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error) {
            if (isAuthApiError(error)) {
                throw createError({ message: error.message, code: 401 });
            }

            throw error;
        }

        if (data && data.session != null) {

            Logger.Info("Token refreshed", { refreshToken: refreshToken });
            return data;
        }
    }

    public static async resetPassword(email: string, newPassword: string) {
        const supabase = createClient();
        let data, error;

        ({ data, error } = await supabase.auth.resetPasswordForEmail(email));

        if (error) {
            throw createError({ message: "Failed to reset password", code: 400 });
        }

        if (data) {
            Logger.Info("Password reset link sent", { email: email });
            return data;
        }

        throw createError({ message: "Password reset failed", code: 400 });
    }

    public static updatePassword = async (email: string, oldPassword: string, newPassword: string) => {
        const supabase = createClient();
        let data, error;


        ({ data, error } = await supabase.auth.updateUser({
            email: email,
            password: newPassword,
        }));

        if (error) {
            throw createError({ message: "Failed to update password", code: 400 });
        }

        if (data) {
            Logger.Info("Password updated", { email: email });
            return data;
        }

        throw createError({ message: "Password update failed", code: 400 });
    }
}
