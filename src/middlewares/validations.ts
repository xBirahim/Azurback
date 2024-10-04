import { Request, Response, NextFunction } from "express";
import { param, cookie, body, header, ValidationChain, validationResult } from "express-validator";
import { ZodSchema } from "zod";
import { Logger } from "../core/logger";

// Types génériques pour les validations
type BaseValidation = {
    required?: boolean;
    custom?: (value: any) => boolean | Promise<boolean>;
    message?: string;
};

type TypedValidation = BaseValidation & {
    type?: "string" | "number" | "boolean";
    schema?: ZodSchema;
};

type QueryParamValidation = {
    [key: string]: {
        type: "string" | "number";
    } & BaseValidation;
};

type CookieValidation =
    | {
          [key: string]: TypedValidation;
      }
    | ZodSchema;

type HeaderValidation =
    | {
          [key: string]: TypedValidation;
      }
    | ZodSchema;

type BodyValidation =
    | {
          [key: string]: TypedValidation;
      }
    | ZodSchema;

/**
 * Fonction utilitaire pour appliquer les règles de validation
 */
const applyValidationRules = (chain: ValidationChain, rules: TypedValidation, fieldName: string): ValidationChain => {
    if (rules.required) {
        chain = chain.exists().withMessage(rules.message || `Le champ ${fieldName} est requis`);
    } else {
        chain = chain.optional();
    }

    if (rules.type) {
        switch (rules.type) {
        case "string":
            chain = chain
                .isString()
                .withMessage(rules.message || `Le champ ${fieldName} doit être une chaîne de caractères`);
            break;
        case "number":
            chain = chain.isNumeric().withMessage(rules.message || `Le champ ${fieldName} doit être un nombre`);
            break;
        case "boolean":
            chain = chain.isBoolean().withMessage(rules.message || `Le champ ${fieldName} doit être un booléen`);
            break;
        }
    }

    if (rules.custom) {
        chain = chain.custom(rules.custom);
    }

    if (rules.schema) {
        chain = chain.custom((value) => {
            try {
                rules.schema!.parse(value);
                return true;
            } catch (error) {
                throw error;
            }
        });
    }

    return chain;
};

// Middleware pour valider les paramètres de requête
export const validateQueryParams = (validations: QueryParamValidation): ValidationChain[] => {
    return Object.entries(validations).map(([paramName, rules]) => {
        let chain = param(paramName);
        return applyValidationRules(chain, rules, paramName);
    });
};

// Middleware pour valider les cookies
export const validateCookies = (validations: CookieValidation): ValidationChain[] => {
    if (validations instanceof ZodSchema) {
        return [
            cookie().custom((value) => {
                try {
                    validations.parse(value);
                    return true;
                } catch (error) {
                    throw error;
                }
            }),
        ];
    }

    return Object.entries(validations).map(([cookieName, rules]) => {
        let chain = cookie(cookieName);
        return applyValidationRules(chain, rules, cookieName);
    });
};

// Middleware pour valider les headers
export const validateHeaders = (validations: HeaderValidation): ValidationChain[] => {
    if (validations instanceof ZodSchema) {
        return [
            header().custom((value) => {
                try {
                    validations.parse(value);
                    return true;
                } catch (error) {
                    throw error;
                }
            }),
        ];
    }

    return Object.entries(validations).map(([headerName, rules]) => {
        let chain = header(headerName);
        return applyValidationRules(chain, rules, headerName);
    });
};

// Middleware pour valider le corps de la requête
export const validateBody = (validations: BodyValidation): ValidationChain[] => {
    if (validations instanceof ZodSchema) {
        return [
            body().custom((value) => {
                try {
                    validations.parse(value);
                    return true;
                } catch (error) {
                    throw error;
                }
            }),
        ];
    }

    return Object.entries(validations).map(([field, rules]) => {
        let chain = body(field);
        return applyValidationRules(chain, rules, field);
    });
};
