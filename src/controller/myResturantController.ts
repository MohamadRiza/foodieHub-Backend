import { Request, Response } from "express";
import cloudinary from "cloudinary";
import Restaurant from "../models/Resturant"; // Ensure the correct spelling of the model
import mongoose from "mongoose";

const getMyResturant = async (req: Request, res: Response)=>{
    try{
        const restaurant = await Restaurant.findOne({ user: req.userId })
        if(!restaurant){
            return res.status(404).json({ message: "Resturant Not Found" })
        }
        res.json(restaurant)
    }
    catch(error){
        console.log("error", error);
        res.status(500).json({ message: "Error Fetching Resturant" })
    }
}

const createMyResturant = async (req: Request, res: Response) => {
    try {
        const existingRestaurant = await Restaurant.findOne({ user: req.userId });

        if (existingRestaurant) {
            return res.status(409).json({ message: "User Restaurant Already Exists!" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image file is required!" });
        }

        const image = req.file as Express.Multer.File;
        const base64Image = Buffer.from(image.buffer).toString("base64");
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;

        const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

        const restaurant = new Restaurant(req.body);
        restaurant.imageUrl = uploadResponse.url;
        restaurant.user = new mongoose.Types.ObjectId(req.userId);
        restaurant.lastUpdated = new Date(); // Set lastUpdated before saving
        await restaurant.save();
        
        res.status(201).json(restaurant);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong!" });
    }
};

export default {
    getMyResturant,
    createMyResturant,
}
