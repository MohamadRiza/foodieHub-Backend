import mongoose, { InferSchemaType } from "mongoose";

const menuItemsSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export type MenuItemType = InferSchemaType<typeof menuItemsSchema>;

const resturantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resturantName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, requeird: true },
  deliveryPrice: { type: Number, required: true },
  estimateDeliveryTime: { type: Number, required: true },
  cuisines: [{ type: String, required: true }],
  menueItems: [menuItemsSchema],
  imageUrl: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
});

const Resturant = mongoose.model("Resturant", resturantSchema);
export default Resturant;
