import { Request, Response } from "express";
import { subscriptionService } from "../services/subscription.service";
import { UpdateSubscriptionDto } from "../types/subscription";

export class SubscriptionController {
  async getAll(req: Request, res: Response) {
    const subscriptions = await subscriptionService.getAll();

    res.json(subscriptions);
  }

  async getById(req: Request<{ id: string }>, res: Response) {
    const subscription = await subscriptionService.getById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        message: "Suscripción no encontrada",
      });
    }

    res.json(subscription);
  }

  async create(req: Request, res: Response) {
    const subscription = await subscriptionService.create(req.body);

    res.status(201).json(subscription);
  }

  async update(
  req: Request<{ id: string }, {}, UpdateSubscriptionDto>,
  res: Response
  ) {
    const subscription = await subscriptionService.update(
      req.params.id,
      req.body
    );

    if (!subscription) {
      return res.status(404).json({
        message: "Suscripción no encontrada",
      });
    }

    res.json(subscription);
  }

  async delete(
    req: Request<{ id: string }>,
    res: Response
  ) {
    const result = await subscriptionService.delete(req.params.id);
    if (result == null) {
      res.sendStatus(204);
    }
    res.sendStatus(200);
  }
}

export const subscriptionController = new SubscriptionController();