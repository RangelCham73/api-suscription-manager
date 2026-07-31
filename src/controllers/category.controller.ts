import { Request, Response } from "express";
import { categoryService } from "../services/category.service";
import type { CategoryParams, CreateCategoryDto } from "../types/category";

export class CategoryController {
  async getAll(req: Request, res: Response) {
    const categories = await categoryService.getAll();

    res.json(categories);
  }

  async getById(
    req: Request<CategoryParams>,
    res: Response
  ) {
    const { id } = req.params;

    const category = await categoryService.getById(id);

    if (!category) {
      return res.status(404).json({
        message: "Categoría no encontrada",
      });
    }

    res.json(category);
  }

  async create(
    req: Request<{}, {}, CreateCategoryDto>,
    res: Response
  ) {
    const category = await categoryService.create(req.body);

    res.status(201).json(category);
  }
}

export const categoryController = new CategoryController();