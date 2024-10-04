import express from "express";
import { emoji, chat, mail, cacheWrite, cacheRead, database } from "../controllers/sample.controller";

const sampleRoutes = express.Router();

sampleRoutes.get("/emoji", emoji);
sampleRoutes.get("/chat", chat);
sampleRoutes.post("/mail", mail);
sampleRoutes.post("/cache/write", cacheWrite);
sampleRoutes.post("/cache/read", cacheRead);
sampleRoutes.get("/database", database);

export default sampleRoutes;
