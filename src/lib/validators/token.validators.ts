import { z } from "zod";

export const AccesTokenPayloadValidator = z.object({
    iss: z.string(),
    sub: z.string(),
    aud: z.string(),
    exp: z.number(),
    iat: z.number(),
    email: z.string(),
    phone: z.string(),
    app_metadata: z.object({
        provider: z.string(),
        providers: z.array(z.string()),
    }),
    user_metadata: z.object({
        email: z.string(),
        email_verified: z.boolean(),
        firstname: z.string(),
        lastname: z.string(),
        phone_verified: z.boolean(),
        sub: z.string(),
    }),
    role: z.string(),
    aal: z.string(),
    amr: z.array(z.object({ method: z.string(), timestamp: z.number() })),
    session_id: z.string(),
    is_anonymous: z.boolean(),
});
