import express, { Express } from "express";
import v1Router from "./api/v1/routes";

const app: Express = express();

app.use(express.json());

app.use("/api/v1", v1Router);

export default app;
