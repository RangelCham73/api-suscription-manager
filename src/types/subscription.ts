import { BillingCycle } from "@prisma/client";

export interface CreateSubscriptionDto {
  name: string;
  category: string;
  billingCycle: BillingCycle;
  startDate: string;
  amount: number;
}

export interface UpdateSubscriptionDto {
  name: string;
  category: string;
  billingCycle: BillingCycle;
  amount: number;
  active: boolean;
}