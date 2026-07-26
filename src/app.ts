import express from "express";
import cors from "cors";

import categoryRoutes from "./routes/category.route";
import subscriptionRoutes from "./routes/subscription.route";
import paymentRoutes from "./routes/payment.route";
import statisticsRoutes from "./routes/statistic.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    message: "Subscription Manager API",
    status: "OK",
  });
});

app.use("/categories", categoryRoutes);
app.use("/subscriptions", subscriptionRoutes);
app.use("/payments", paymentRoutes);
app.use("/statistics", statisticsRoutes);

export default app;