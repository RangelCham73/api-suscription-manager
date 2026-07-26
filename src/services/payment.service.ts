import { prisma } from "../../lib/prisma";

export class PaymentService {
  async getAll() {
    return prisma.payment.findMany({
      include: {
        subscription: {
          include: {
            category: true,
          },
        },
      },
      orderBy: {
        paymentDate: "desc",
      },
    });
  }

  async getById(id: string) {
    return prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        subscription: {
          include: {
            category: true,
          },
        },
      },
    });
  }
}

export const paymentService = new PaymentService();