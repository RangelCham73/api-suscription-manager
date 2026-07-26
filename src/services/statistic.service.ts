import { prisma } from "../../lib/prisma";

export class StatisticsService {
  async getDashboard() {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        payments: true,
      },
    });

    const activeSubscriptions = subscriptions.filter(
      (subscription) => subscription.active
    ).length;

    const monthlySpend = subscriptions.reduce((total, subscription) => {
      if (!subscription.active) return total;

      const latestPayment = subscription.payments.at(-1);

      if (!latestPayment) return total;

      return (
        total +
        (subscription.billingCycle === "MONTHLY"
          ? Number(latestPayment.amount)
          : Number(latestPayment.amount) / 12)
      );
    }, 0);

    return {
      activeSubscriptions,
      monthlySpend,
    };
  }
}

export const statisticsService = new StatisticsService();