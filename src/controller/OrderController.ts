import { Request, Response } from "express";
import Stripe from "stripe";
import Resturant, { MenuItemType } from "../models/Resturant";
import Order from "../models/Order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);

const FRONTEND_URL = process.env.FRONTEND_URL as string;

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("resturant")
      .populate("user");
      
      res.json(orders);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

type checkoutSessionRequest = {
  cartItems: {
    menueitemsId: string; //chack here
    name: string;
    quantity: string;
  }[];
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  resturantId: string;
};

const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = STRIPE.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type == "checkout.session.completed") {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.totalAmmount = event.data.object.amount_total;
    order.status = "paid";

    await order.save();
  }

  res.status(200).send();
};

const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: checkoutSessionRequest = req.body;

    const resturant = await Resturant.findById(
      checkoutSessionRequest.resturantId
    );

    if (!resturant) {
      throw new Error("Resturant not found");
    }

    const newOrder = new Order({
      resturant: resturant,
      user: req.userId,
      status: "placed",
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartitems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    const lineItems = createlLineItems(
      checkoutSessionRequest,
      resturant.menueItems
    );

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      resturant.deliveryPrice,
      resturant._id.toString()
    );

    if (!session.url) {
      return res.status(500).json({ message: "Error creating stripe session" });
    }

    await newOrder.save();
    res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};

const createlLineItems = (
  checkoutSessionRequest: checkoutSessionRequest,
  menueItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    //chack here
    const menueItem = menueItems.find(
      (item) => item._id.toString() === cartItem.menueitemsId.toString()
    );

    if (!menueItem) {
      throw new Error(`menu item not found: ${cartItem.menueitemsId}`);
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "usd",
        unit_amount: menueItem.price,
        product_data: {
          name: menueItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  resturantId: string
) => {
  //chack here
  const sessionData = await STRIPE.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Delivery",
          type: "fixed_amount",
          fixed_amount: {
            amount: deliveryPrice,
            currency: "usd",
          },
        },
      },
    ],

    mode: "payment",
    metadata: {
      orderId,
      resturantId,
    },

    success_url: `${FRONTEND_URL}/order-status?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${resturantId}?cancelled=true`,
  });
  return sessionData;
};

export default {
  getMyOrders,
  createCheckoutSession,
  stripeWebhookHandler,
};
