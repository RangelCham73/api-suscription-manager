import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

interface PaymentParams {
  id: string;
}

export class PaymentController {
  async getAll(req: Request, res: Response) {
    const payments = await paymentService.getAll();

    res.json(payments);
  }

  async getById(
    req: Request<PaymentParams>,
    res: Response
  ) {
    const { id } = req.params;

    const payment = await paymentService.getById(id);

    if (!payment) {
      return res.status(404).json({
        message: "Pago no encontrado",
      });
    }

    res.json(payment);
  }
}

export const paymentController =
  new PaymentController();