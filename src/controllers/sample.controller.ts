import { Request, Response } from "express";
import { createErrorResponse, createSuccessResponse } from "../lib/helpers/response.helper";
import { MailManager, mailService } from "../core/mail";
import { sendMailBodySchema } from "../lib/validators";
import { CacheManager } from "../core/cache";
import { db } from "../database/db";

export const emoji = async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json(["😀", "😳", "🙄"]);
};

export const chat = async (req: Request, res: Response): Promise<void> => {
    res.status(200).send(
        MailManager.getEmailContent(
            "email-confirmation.html",
            { key: "username", value: "Dixit" },
            { key: "link", value: "https://www.youtube.com" }
        )
    );
};

export const mail = async (req: Request, res: Response): Promise<Response> => {
    const { to, subject, text, html } = sendMailBodySchema.parse(req.body);

    try {
        await mailService.sendMail({
            to,
            subject,
            text,
            html,
        });
        return createSuccessResponse(res, { status: 200, message: "Mail sent successfully !" });
    } catch (error) {
        return createErrorResponse(res, { status: 500, message: "Mail not sent !", error: error });
    }
};

export const cacheWrite = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cachekey, cachevalue, cachettl } = req.body;

        const cacheService = new CacheManager();

        await cacheService.set(cachekey, cachevalue, cachettl);

        console.log(await cacheService.getAllKeys());

        return res.status(200).json({ message: "Cache test successful !" });
    } catch (error) {
        return createErrorResponse(res, { status: 500, message: "Cache test failed !", error: error });
    }
};

export const cacheRead = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cachekey } = req.body;

        const cacheService = new CacheManager();

        const cacheValue = await cacheService.get(cachekey);

        return res.status(200).json({ message: "Cache read successful !", cacheValue });
    } catch (error) {
        return createErrorResponse(res, { status: 500, message: "Cache read failed !", error: error });
    }
};

export const database = async (req: Request, res: Response): Promise<Response> => {
    return createSuccessResponse(res, { status: 200, message: "test successful !", data: "cook" });
};
