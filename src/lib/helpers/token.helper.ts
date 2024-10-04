import { Request } from "express";
import jwt from "jsonwebtoken";
import secret from "../../config/secret.config";

const tokenExpiry = "1h"; // Token expiry time

interface TokenPayload {
    sub: string;
    email: string;
}

export const createToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, secret, { expiresIn: tokenExpiry });
};

export const extractToken = (req: Request) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
};

export const validateToken = (token: string, secret: string, ignoreExpiration: boolean = false) => {
    try {
        const payload = jwt.verify(token, secret, { ignoreExpiration: ignoreExpiration });
        return { valid: true, decoded: payload };
    } catch (error) {
        return { valid: false, error: error };
    }
};

export const decodeToken = (token: string) => {
    return jwt.decode(token);
};
