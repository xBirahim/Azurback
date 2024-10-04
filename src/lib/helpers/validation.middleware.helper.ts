import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain, body, query, param, header, cookie } from "express-validator";
import { MiddlewareType } from "../constants/MiddlewareType";
import { Logger } from "../../core/logger";
import { createError } from "../errors/app.error";

interface MiddlewareConfig {
    name: string;
    error: string;
    validations: ValidationConfig[];
    type: MiddlewareType;
}

interface ValidationConfig {
    name: string;
    required?: boolean;
    customValidator?: (value: any) => boolean | Promise<boolean>;
    message?: string;
}

/**
 * Génère un middleware de validation en fonction de la configuration fournie.
 * @param configs - Tableau de ValidationConfig qui définit les règles de validation pour chaque champ.
 * @returns Un tableau de RequestHandler[] qui inclut les validations et la gestion des erreurs.
 */
export const generateValidationMiddleware = (middleware: MiddlewareConfig): RequestHandler[] => {
    const validations: ValidationChain[] = middleware.validations.map((config) => {
        let validation: ValidationChain;

        // Choisir le type de validation en fonction du type spécifié
        switch (middleware.type) {
            case "body":
                validation = body(config.name);
                break;
            case "query":
                validation = query(config.name);
                break;
            case "param":
                validation = param(config.name);
                break;
            case "header":
                validation = header(config.name);
                break;
            case "cookie":
                validation = cookie(config.name);
                break;
            default:
                throw new Error(`Unknown validation type: ${middleware.type}`);
        }

        // Appliquer les validations communes
        if (config.required) {
            validation = validation
                .exists({ checkFalsy: true })
                .withMessage(config.message || `'${config.name}' is required.`);
        }

        if (config.customValidator) {
            validation = validation.custom(config.customValidator);
        }

        return validation;
    });

    return [
        ...validations,
        (req: Request, res: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                Logger.Error(`Middleware Error - ${middleware.name}`, errors.array());
                next(
                    createError({
                        message: middleware.error,
                        code: 400,
                        isOperational: false,
                        cause: errors.array(),
                    })
                );
            }
            next();
        },
    ];
};
