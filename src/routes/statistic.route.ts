import { Router } from "express";
import { statisticsController } from "../controllers/statistic.controller";

const router = Router();

router.get("/", statisticsController.getDashboard);

export default router;