import { generateValidationMiddleware } from "../lib/helpers/validation.middleware.helper";
import { MiddlewareType } from "../lib/constants/MiddlewareType";

interface QueryParamConfig {
    name: string;
    required?: boolean;
    customValidator?: (value: any) => boolean | Promise<boolean>;
    message?: string;
}

export const hasQueryParam = (...params: QueryParamConfig[]) => {
    const configs = params.map((param) => ({
        ...param
    }));

    return generateValidationMiddleware({
        name: hasQueryParam.name,
        type: MiddlewareType.Query,
        error: "Missing Query Parameters",
        validations: configs,
    });
};
