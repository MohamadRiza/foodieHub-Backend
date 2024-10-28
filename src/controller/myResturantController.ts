import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Restaurant from "../models/Resturant"; // Ensure the correct spelling of the model
import mongoose from "mongoose";
import Order from "../models/Order";

const getMyResturant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Resturant Not Found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error Fetching Resturant" });
  }
};

const createMyResturant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });

    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User Restaurant Already Exists!" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required!" });
    }

    //const image = req.file as Express.Multer.File;
    //const base64Image = Buffer.from(image.buffer).toString("base64");
    //const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    //const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date(); // Set lastUpdated before saving
    await restaurant.save();

    res.status(201).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};

const updateMyResturant = async (req: Request, res: Response) => {
  try {
    const resturant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!resturant) {
      return res.status(404).json({ message: "Resturant Not Found!" });
    }

    resturant.resturantName = req.body.resturantName;
    resturant.city = req.body.city;
    resturant.country = req.body.country;
    resturant.deliveryPrice = req.body.deliveryPrice;
    resturant.estimateDeliveryTime = req.body.estimateDeliveryTime;
    resturant.cuisines = req.body.cuisines;
    resturant.menueItems = req.body.menueItems;
    resturant.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      resturant.imageUrl = imageUrl;
    }

    await resturant.save();
    res.status(200).send(resturant);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};

const getMyResturantOrders = async (req: Request, res: Response) => {
  try {
    const resturant = await Restaurant.findOne({ user: req.userId });
    if (!resturant) {
      return res.status(404).json({ message: "resturant not found" });
    }

    const orders = await Order.find({ resturant: resturant._id })
      .populate("resturant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if(!order){
      return res.status(404).json({ message: "order not found" });
    }

    const restaurant = await Restaurant.findById(order.resturant)

    if(restaurant?.user?._id.toString() !== req.userId){
      return res.status(401).send();
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to update order status" })
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  updateOrderStatus,
  getMyResturantOrders,
  updateMyResturant,
  getMyResturant,
  createMyResturant,
};
