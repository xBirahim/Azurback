import nodemailer, { Transporter } from "nodemailer";
import { MailOptions } from "../lib/interfaces/MailOptions";
import Env from "../config/env.config";
import { Logger } from "./logger";
import fs from "fs";
import path from "path";

export class MailManager {
    private static instance: MailManager;
    private transporter: Transporter;

    private constructor() {
        this.transporter = nodemailer.createTransport({
            host: Env.MAIL_HOST,
            port: Number(Env.NODE_ENV == "production" ? Env.MAIL_TLS_PORT : Env.MAIL_SSL_PORT),
            secure: Env.MAIL_SECURE ?? Env.NODE_ENV === "production",
            auth: {
                user: Env.MAIL_USERNAME,
                pass: Env.MAIL_PASSWORD,
            },
        });
    }

    public static getInstance(): MailManager {
        if (!MailManager.instance) {
            MailManager.instance = new MailManager();
        }
        return MailManager.instance;
    }

    async sendMail(mailOptions: MailOptions): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: Env.MAIL_FROM,
                to: mailOptions.to,
                subject: mailOptions.subject,
                text: mailOptions.text,
                html: mailOptions.html,
            });
            Logger.Info("Mail sent successfully", { to: mailOptions.to, subject: mailOptions.subject });
        } catch (error) {
            Logger.Error("Error while sending mail", { error });
            throw error;
        }
    }

    public static getEmailContent(filename: string, ...replacements: { key: string; value: string }[]): string {
        const filePath = path.join(__dirname, "..", "emails", filename);

        let content = fs.readFileSync(filePath).toString();

        for (const replacement of replacements) {
            content = content.replace(new RegExp(`{{${replacement.key}}}`, "g"), replacement.value);
        }

        return content;
    }
}

export const mailService = MailManager.getInstance();
