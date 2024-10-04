import { NextFunction, Request, Response } from "express";
import { createError } from "../../lib/errors/app.error";

export function notFound(req: Request, res: Response, next: NextFunction) {
    throw createError({ message: `Not Found - ${req.method} ${req.originalUrl}`, code: 404 });
}
