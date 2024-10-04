import { Express } from "express";
import { serve, setup } from "swagger-ui-express";
import { default as swaggerDocument } from "../../swagger-output.json";

import sampleRoutes from "./sample.routes";
import authRoutes from "./auth.routes";
import clientRoutes from "./client.routes";

const baseurl = "/api/v1";

export const buildRoutes = function (app: Express) {
    app.use(baseurl + "/docs", serve, setup(swaggerDocument));

    app.use(baseurl + "/auth", authRoutes);
    app.use(baseurl + "/sample", sampleRoutes);
    app.use(baseurl + "/client", clientRoutes);
};

