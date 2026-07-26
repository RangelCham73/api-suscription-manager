import { Request, Response } from "express";
import { subscriptionService } from "../services/subscription.service";

interface SubscriptionParams {
  id: string;
}

export class SubscriptionController {
  async getAll(req: Request, res: Response) {
    const subscriptions = await subscriptionService.getAll();

    res.json(subscriptions);
  }

  async getById(
    req: Request<SubscriptionParams>,
    res: Response
  ) {
    const { id } = req.params;

    const subscription = await subscriptionService.getById(id);

    if (!subscription) {
      return res.status(404).json({
        message: "Suscripción no encontrada",
      });
    }

    res.json(subscription);
  }
}

export const subscriptionController =
  new SubscriptionController();