import Express from "express";
import { jwtCheck, jwtParse } from "../MiddleWare/Auth";
import OrderController from "../controller/OrderController";

const router = Express.Router();

router.get("/", jwtCheck, jwtParse, OrderController.getMyOrders)

router.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  OrderController.createCheckoutSession
); //check here

router.post("/checkout/webhook", OrderController.stripeWebhookHandler)

export default router;
