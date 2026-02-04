/**
 * HTTP handler for GET /api/v1/health.
 */

import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { getHealthInfo } from "../services/healthService";

export const getHealth = (_req: Request, res: Response): void => {
    const healthInfo = getHealthInfo();
    res.status(HTTP_STATUS.OK).json(healthInfo);
};
