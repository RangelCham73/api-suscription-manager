import { Router } from "express";
import { categoryController } from "../controllers/category.controller";

const router = Router();

router.get("/", categoryController.getAll);
router.get("/:id", categoryController.getById);

export default router;