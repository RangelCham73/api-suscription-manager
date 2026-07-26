import { Request, Response } from "express";
import { statisticsService } from "../services/statistic.service";

export class StatisticsController {
  async getDashboard(req: Request, res: Response) {
    const statistics =
      await statisticsService.getDashboard();

    res.json(statistics);
  }
}

export const statisticsController =
  new StatisticsController();