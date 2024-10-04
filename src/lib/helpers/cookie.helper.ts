import { CookieOptions, Response, Request } from "express";

interface AddCookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: boolean | "strict" | "lax" | "none";
    maxAge?: number;
}

export const setCookie = (res: Response, name: string, token: string, options?: AddCookieOptions): void => {
    const cookieOptions: CookieOptions = {
        httpOnly: options?.httpOnly ?? true,
        secure: options?.secure ?? process.env.NODE_ENV === "production",
        sameSite: options?.sameSite ?? "lax",
        maxAge: options?.maxAge ?? 3600000, // 1 hour
    };
    res.cookie(name, token, cookieOptions);
};

export const removeCookie = (res: Response, name: string): void => {
    res.clearCookie(name);
};

export const getCookie = (req: Request, name: string): string | undefined => {
    return req.cookies[name];
};
