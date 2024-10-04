import { Request, Response, NextFunction } from "express";
import { CacheManager } from "../core/cache";
import { Logger } from "../core/logger";
import { createErrorResponse } from "../lib/helpers/response.helper";

const cacheService = new CacheManager();

interface RateLimiterOptions {
    window: number;
    limit: number;
    status?: number;
    message?: string;
    handler?: (req: Request, res: Response, next: NextFunction) => void;
}

/**
 * Middleware to limit the rate of incoming requests based on IP address.
 *
 * @param {RateLimiterOptions} options - Configuration options for the rate limiter.
 * @param {number} options.limit - The maximum number of requests allowed within the specified window.
 * @param {number} options.window - The time window in milliseconds for which the limit is applied.
 * @param {number} options.status - The HTTP status code to return when the rate limit is exceeded.
 * * `429` by default.
 * @param {string} options.message - The message to return when the rate limit is exceeded.
 * * "Too many requests, please try again later." by default.
 * @param {function} [options.handler] - Optional custom handler function to execute when the rate limit is exceeded.
 *
 * @returns {Function} An express middleware function to enforce rate limiting.
 *
 *  *
 * The middleware uses a cache service to track the number of requests from each IP address.
 * If the number of requests exceeds the specified maximum within the time window, a status (`429` by default)
 * code response is sent.
 *
 * @example
 * ```typescript
 * app.use(rateLimiter({ windowMs: 60000, max: 100 }));
 * ```
 */
const rateLimiter = (options: RateLimiterOptions) => {
    const statusCode = options.status || 429;

    return async (req: Request, res: Response, next: NextFunction) => {
        const key = `rate-limit:${req.ip}`;
        const current = await cacheService.get(key);

        if (current) {
            const requests = parseInt(current, 10);

            if (requests >= options.limit) {
                Logger.Warn("Too many requests", { ip: req.ip, headers: req.headers, options: options });

                if (options.handler) {
                    return options.handler(req, res, next);
                }

                return createErrorResponse(res, {
                    status: statusCode,
                    message: options.message || "Too many requests, please try again later.",
                });
            }

            await cacheService.set(key, (requests + 1).toString(), options.window / 1000);
        } else {
            await cacheService.set(key, "1", options.window / 1000);
        }

        next();
    };
};

export default rateLimiter;
