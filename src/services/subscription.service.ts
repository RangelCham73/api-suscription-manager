import { BillingCycle, PaymentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { CreateSubscriptionDto, UpdateSubscriptionDto } from "../types/subscription";

export class SubscriptionService {
  async getAll() {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        category: true,
        payments: {
          orderBy: {
            paymentDate: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return subscriptions.map((subscription) => {
      const lastPayment = subscription.payments[0];

      return {
        id: subscription.id,
        name: subscription.name,
        category: subscription.category.name,
        amount: Number(lastPayment?.amount ?? 0),
        billingCycle:
          subscription.billingCycle === "MONTHLY"
            ? "monthly"
            : "yearly",
        nextPaymentDate: lastPayment?.periodEnd ?? subscription.startDate,
        reminderDays: 0, // Hasta que añadas este campo al modelo
        active: subscription.active,
      };
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
  
  async create(data: CreateSubscriptionDto) {
    return prisma.$transaction(async (tx) => {
      // Buscar la categoría
      let category = await tx.category.findUnique({
        where: {
          name: data.category,
        },
      });

      // Si no existe, crearla
      if (!category) {
        category = await tx.category.create({
          data: {
            name: data.category,
          },
        });
      }

      // Crear la suscripción
      const subscription = await tx.subscription.create({
        data: {
          name: data.name,
          categoryId: category.id,
          billingCycle: data.billingCycle,
          startDate: new Date(data.startDate),
          active: true,
        },
      });

      const periodStart = new Date(data.startDate);
      const periodEnd = new Date(periodStart);

      if (data.billingCycle === BillingCycle.MONTHLY) {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      // Registrar el primer pago
      await tx.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: data.amount,
          paymentDate: periodStart,
          periodStart,
          periodEnd,
          status: PaymentStatus.PAID,
        },
      });

      return tx.subscription.findUnique({
        where: {
          id: subscription.id,
        },
        include: {
          category: true,
          payments: true,
        },
      });
    });
  }

  async update(
    id: string,
    data: UpdateSubscriptionDto
  ) {
    return prisma.$transaction(async (tx) => {

      let category = await tx.category.findUnique({
        where: {
          name: data.category,
        },
      });

      if (!category) {
        category = await tx.category.create({
          data: {
            name: data.category,
          },
        });
      }

      await tx.subscription.update({
        where: {
          id,
        },
        data: {
          name: data.name,
          billingCycle: data.billingCycle,
          categoryId: category.id,
          active: data.active,
        },
      });

      const latestPayment = await tx.payment.findFirst({
        where: {
          subscriptionId: id,
        },
        orderBy: {
          paymentDate: "desc",
        },
      });

      if (latestPayment) {
        await tx.payment.update({
          where: {
            id: latestPayment.id,
          },
          data: {
            amount: data.amount,
          },
        });
      }

      return tx.subscription.findUnique({
        where: {
          id,
        },
        include: {
          category: true,
          payments: {
            orderBy: {
              paymentDate: "desc",
            },
            take: 1,
          },
        },
      });
    });
  }

  async delete(id: string) {
    return prisma.subscription.delete({
      where: {
        id,
      },
    });
  }
}

export const subscriptionService = new SubscriptionService();