import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute"
import { v2 as cloudinary } from "cloudinary";
import myResturantRoute from "./routes/myResturantRoute";
import resturantRoute from "./routes/ResturantRoute";

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=> console.log("connected to Database!"))

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
app.use(express.json())
app.use(cors())

app.get("/helth", async (req: Request, res: Response)=>{
    res.send({ message: "helth" })
})

app.use("/api/my/user", myUserRoute);
app.use("/api/my/resturant", myResturantRoute)
app.use("/api/my/resturant", resturantRoute);

app.listen(7000, ()=> {
    console.log("server started on localhost:7000");
})