import { MiddlewareType } from "../lib/constants/MiddlewareType";
import { generateValidationMiddleware } from "../lib/helpers/validation.middleware.helper";

interface HeaderConfig {
    name: string;
    required?: boolean;
    customValidator?: (value: any) => boolean | Promise<boolean>;
    message?: string;
}

export const hasHeaders = (...headers: HeaderConfig[]) => {
    const configs = headers.map((header) => ({
        ...header,
        type: MiddlewareType.Header,
    }));

    return generateValidationMiddleware({
        name: hasHeaders.name,
        type: MiddlewareType.Header,
        error: "Missing Header(s)",
        validations: configs,
    });
};
