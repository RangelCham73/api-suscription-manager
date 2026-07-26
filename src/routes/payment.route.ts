import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";

const router = Router();

router.get("/", paymentController.getAll);
router.get("/:id", paymentController.getById);

export default router;