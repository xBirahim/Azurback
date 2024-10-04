import { Response } from "express";

interface BaseResponse {
    message?: string;
    status: number;
    metadata?: any;
}

interface SuccessResponse<T> extends BaseResponse {
    data?: T;
}

interface ErrorResponse extends BaseResponse {
    error?: any;
}

export const createSuccessResponse = <T>(res: Response, options: SuccessResponse<T>): Response => {
    const response: SuccessResponse<T> = options;
    return res.status(options.status).json(response);
};

export const createErrorResponse = (res: Response, options: ErrorResponse): Response => {
    const response: ErrorResponse = options;
    return res.status(options.status).json(response);
};
