import { prisma } from "../../lib/prisma";

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
}

export const categoryService = new CategoryService();