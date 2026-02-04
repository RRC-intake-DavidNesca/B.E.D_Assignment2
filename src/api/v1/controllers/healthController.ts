/**
 * Controller for the v1 health endpoint.
 * Delegates response body creation to HealthService and uses HTTP_STATUS for codes.
 */

import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import { HealthService } from "../services/healthService";

export class HealthController {
    public getHealthStatus(_req: Request, res: Response): Response {
        const healthStatus = HealthService.getHealthStatus();
        return res.status(HTTP_STATUS.OK).json(healthStatus);
    }
}

const healthController: HealthController = new HealthController();

export const getHealth = (req: Request, res: Response): Response => {
    return healthController.getHealthStatus(req, res);
};
