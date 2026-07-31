import { prisma } from "../../lib/prisma";

export class StatisticsService {
  async getDashboard() {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        category: true,
        payments: {
          orderBy: {
            paymentDate: "asc",
          },
        },
      },
    });

    const activeSubscriptions = subscriptions.filter(
      (subscription) => subscription.active
    );

    // ===========================
    // RESUMEN
    // ===========================

    const annualSpend = activeSubscriptions.reduce((total, subscription) => {
      const latestPayment = subscription.payments.at(-1);

      if (!latestPayment) return total;

      const amount = Number(latestPayment.amount);

      return (
        total +
        (subscription.billingCycle === "MONTHLY"
          ? amount * 12
          : amount)
      );
    }, 0);

    const monthlyAverage = annualSpend / 12;

    const mostExpensive =
      activeSubscriptions
        .map((subscription) => ({
          name: subscription.name,
          amount: Number(
            subscription.payments.at(-1)?.amount ?? 0
          ),
        }))
        .sort((a, b) => b.amount - a.amount)[0] ?? {
        name: "-",
        amount: 0,
      };

    // ===========================
    // GRÁFICA MENSUAL
    // ===========================

    const monthlyMap = new Map<string, number>();

    subscriptions.forEach((subscription) => {
      subscription.payments.forEach((payment) => {
        const month = payment.paymentDate.toLocaleDateString(
          "es-ES",
          {
            month: "short",
          }
        );

        monthlyMap.set(
          month,
          (monthlyMap.get(month) ?? 0) +
            Number(payment.amount)
        );
      });
    });

    const monthlyChart = Array.from(monthlyMap.entries()).map(
      ([month, amount]) => ({
        month,
        amount,
      })
    );

    // ===========================
    // GRÁFICA POR CATEGORÍA
    // ===========================

    const categoryMap = new Map<string, number>();

    activeSubscriptions.forEach((subscription) => {
      const latestPayment = subscription.payments.at(-1);

      if (!latestPayment) return;

      const category = subscription.category.name;

      categoryMap.set(
        category,
        (categoryMap.get(category) ?? 0) +
          Number(latestPayment.amount)
      );
    });

    const categoryChart = Array.from(categoryMap.entries()).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );

    // ===========================
    // TOP SUSCRIPCIONES
    // ===========================

    const topSubscriptions = activeSubscriptions
      .map((subscription) => ({
        id: subscription.id,
        name: subscription.name,
        amount: Number(
          subscription.payments.at(-1)?.amount ?? 0
        ),
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      summary: {
        annualSpend,
        monthlyAverage,
        activeSubscriptions: activeSubscriptions.length,
        mostExpensive,
      },

      monthlyChart,

      categoryChart,

      topSubscriptions,
    };
  }
}

export const statisticsService = new StatisticsService();