import { Request, Response, Router } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

const v1Router: Router = Router();

v1Router.get("/health", (_req: Request, res: Response): void => {
    res.status(HTTP_STATUS.OK).json({ status: "ok" });
});

export default v1Router;
