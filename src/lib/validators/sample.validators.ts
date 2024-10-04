import { z } from "zod";

export const sendMailBodySchema = z.object({
    to: z.string().email(),
    subject: z.string().optional(),
    text: z.string().optional(),
    html: z.string().optional(),
});
