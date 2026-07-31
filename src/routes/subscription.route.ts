import { Router } from "express";
import { subscriptionController } from "../controllers/subscription.controller";

const router = Router();

router.get("/", subscriptionController.getAll);
router.get("/:id", subscriptionController.getById);
router.post("/", subscriptionController.create);
router.put("/:id", subscriptionController.update);
router.delete("/:id", subscriptionController.delete);

export default router;