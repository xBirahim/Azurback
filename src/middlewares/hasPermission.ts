import { Request, Response, NextFunction } from "express";
import Permission from "../lib/constants/Permission";
import { Permission as PermissionTable, ProfilePermission, Profile, UserProfile, User } from "../database/schemas";
import { eq } from "drizzle-orm";
import { db } from "../database/db";
import { createErrorResponse } from "../lib/helpers/response.helper";
import { getCookie } from "../lib/helpers/cookie.helper";
import { AccessTokenKey } from "../lib/constants/TokenKeys";
import { decodeToken } from "../lib/helpers/token.helper";
import { Logger } from "../core/logger";

export const hasPermissions = (permissions: Permission[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = getCookie(req, AccessTokenKey)!;
        const payload = decodeToken(token);

        const uuid = payload?.sub as string;

        try {
            const query = db
                .select({ code: PermissionTable.code })
                .from(PermissionTable)
                .innerJoin(ProfilePermission, eq(PermissionTable.id, ProfilePermission.permissionId))
                .innerJoin(Profile, eq(ProfilePermission.profileId, Profile.id))
                .innerJoin(UserProfile, eq(Profile.id, UserProfile.profileId))
                .innerJoin(User, eq(UserProfile.userId, User.id))
                .where(eq(User.uuid, uuid));

            const userPermissions = await query.execute();

            const userPermissionCodes = userPermissions.map((perm) => perm.code);

            const userHasPermissions = permissions.every((permission) => userPermissionCodes.includes(permission));

            if (!userHasPermissions) {
                return createErrorResponse(res, { status: 403, message: "Insufficient permissions" });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
