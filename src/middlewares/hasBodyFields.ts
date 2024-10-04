import { generateValidationMiddleware } from "../lib/helpers/validation.middleware.helper";
import { MiddlewareType } from "../lib/constants/MiddlewareType";

interface BodyFieldConfig {
    name: string;
    required?: boolean;
    customValidator?: (value: any) => boolean | Promise<boolean>;
    message?: string;
}

export const hasBodyFields = (...fields: BodyFieldConfig[]) => {
    const configs = fields.map((field) => ({
        ...field,
    }));

    return generateValidationMiddleware({
        name: hasBodyFields.name,
        type: MiddlewareType.Body,
        error: "Missing Query Parameters",
        validations: configs,
    });
};
