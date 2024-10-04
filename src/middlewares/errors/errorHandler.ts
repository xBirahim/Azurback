import { NextFunction, Request, Response } from "express";

import ErrorResponse from "../../lib/interfaces/ErrorResponse";
import { createErrorResponse } from "../../lib/helpers/response.helper";
import { isAppError } from "../../lib/errors/app.error";
import { Logger } from "../../core/logger";
import { validationResult } from "express-validator";
import {
    isAuthSessionMissingError,
    isAuthApiError,
    isAuthError,
    isAuthRetryableFetchError,
    isAuthWeakPasswordError,
} from "@supabase/supabase-js";


export function errorHandler(err: any, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return createErrorResponse(res, { status: 400, metadata: { errors: errors.array() } });
    }

    if (isAppError(err)) {
        Logger.Error(err.message, err);
        return createErrorResponse(res, { status: err.statusCode, error: err.message, metadata: err.cause });
    }

    if (isAuthSessionMissingError(err)) {
        Logger.Error("Auth session missing", err);
        return createErrorResponse(res, { status: 401, error: "Unauthorized" });
    }

    if (isAuthApiError(err)) {
        Logger.Error("Auth API error", err);
        return createErrorResponse(res, { status: 401, error: "Unauthorized" });
    }

    if (isAuthError(err)) {
        Logger.Error("Auth error", err);
        return createErrorResponse(res, { status: 401, error: "Unauthorized" });
    }

    if (isAuthRetryableFetchError(err)) {
        Logger.Error("Auth retryable fetch error", err);
        return createErrorResponse(res, { status: 500, error: "Internal server error" });
    }

    if (isAuthWeakPasswordError(err)) {
        Logger.Error("Auth weak password error", err);
        return createErrorResponse(res, { status: 400, error: "Weak password" });
    }

    if (err instanceof SyntaxError){
        Logger.Error("Syntax error", err);
        return createErrorResponse(res, { status: 400, error: "Bad request" });
    }

    Logger.Error("Unhandled error", err.stack ? { error: err, stack: err.stack } : { error: err });
    return createErrorResponse(res, { status: 500, error: "Internal server error" });
}
