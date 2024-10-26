import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  resturant: { type: mongoose.Schema.Types.ObjectId, ref: "Resturant" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  deliveryDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
  },
  cartitems: [
    {
      menueitemsId: { type: String, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  totalAmmount: Number,
  status: {
    type: String,
    enum: ["placed", "paid", "inProgress", "outForDelivery", "delivered"],
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
