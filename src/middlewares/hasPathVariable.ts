import { generateValidationMiddleware } from "../lib/helpers/validation.middleware.helper";
import { MiddlewareType } from "../lib/constants/MiddlewareType";

interface PathVariableConfig {
    name: string;
    customValidator?: (value: any) => boolean | Promise<boolean>;
    message?: string;
}

export const hasPathVariable = (config: PathVariableConfig) => {
    return generateValidationMiddleware({
        name: hasPathVariable.name,
        type: MiddlewareType.Param,
        error: "Missing Path Variable",
        validations: [
            {
                ...config,
                required: true,
            },
        ],
    });
};
