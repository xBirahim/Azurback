import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan, { token } from "morgan";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import { buildRoutes } from "./routes/index.routes";
import { notFound } from "./middlewares/errors/notFound";
import { errorHandler } from "./middlewares/errors/errorHandler";
import { Logger } from "./core/logger";

const app = express();

// Custom morgan token for response time
morgan.token("response-time-ms", (req, res) => {
    return `${res.getHeader("X-Response-Time")}ms`;
});

// Use Morgan with LogService.Http for structured logging
app.use(
    morgan((tokens, req, res) => {
        const method = tokens.method(req, res) ?? "UNKNOWN";
        const url = tokens.url(req, res) ?? "UNKNOWN";
        const status = parseInt(tokens.status(req, res) ?? "0", 10);
        const contentLength = tokens.res(req, res, "content-length");
        const responseTime = parseFloat(tokens["response-time"](req, res) ?? "0");

        Logger.Http(method, url, status, `Content Length: ${contentLength}`, responseTime);

        // Return null to avoid console logging
        return null;
    })
);

app.use(helmet());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

buildRoutes(app);

app.use(notFound);
app.use(errorHandler);

export default app;
