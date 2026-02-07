import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { getHealthStatus } from "../services/healthService";

export function getHealth(_req: Request, res: Response): Response {
    const healthStatus = getHealthStatus();
    return res.status(HTTP_STATUS.OK).json(healthStatus);
}
