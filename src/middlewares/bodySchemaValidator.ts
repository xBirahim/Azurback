import { NextFunction } from "express";
import { ZodSchema } from "zod";

export const bodySchemaValidator = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            next(error);
        }
    };
};
