import { generateValidationMiddleware } from "../lib/helpers/validation.middleware.helper";
import { MiddlewareType } from "../lib/constants/MiddlewareType";

interface CookieConfig {
    name: string;
    required?: boolean;
    validator?: (value: any) => boolean | Promise<boolean>;
    message?: string;
}

export const hasCookies = (...cookies: CookieConfig[]) => {
    const configs = cookies.map((cookie) => ({
        ...cookie,
        type: MiddlewareType.Cookie,
    }));

    return generateValidationMiddleware({
        name: hasCookies.name,
        type: MiddlewareType.Cookie,
        error: "Missing Cookie(s)",
        validations: configs,
    });
};
