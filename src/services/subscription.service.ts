import { prisma } from "../../lib/prisma";

export class SubscriptionService {
  async getAll() {
    return prisma.subscription.findMany({
      include: {
        category: true,
        payments: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  async getById(id: string) {
    return prisma.subscription.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        payments: true,
      },
    });
  }
}

export const subscriptionService = new SubscriptionService();