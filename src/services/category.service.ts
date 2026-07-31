import { prisma } from "../../lib/prisma";
import { CreateCategoryDto } from "../types/category";

export class CategoryService {
  async getAll() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  async getById(id: string) {
    return prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async create(data: CreateCategoryDto) {
    return prisma.category.create({
      data: {
        name: data.name,
      },
    });
  }
}

export const categoryService = new CategoryService();