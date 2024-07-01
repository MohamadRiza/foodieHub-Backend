import mongoose from "mongoose";

const menuItemsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
})

const resturantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resturantName: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, requeird: true },
    deliveryPrice: { type: String, required: true },
    estimateDeliveryTime: { type: Number, required: true },
    cuisines: [{ type: String, required: true }],
    menueItems: [ menuItemsSchema ],
    imageUrl: { type: String, required: true },
    lastUpdated: { type: Date, required: true }
});

const Resturant = mongoose.model("Resturant", resturantSchema);
export default Resturant;