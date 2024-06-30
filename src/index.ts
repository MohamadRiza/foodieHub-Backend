import express, {Request, Response} from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/myUserRoute"

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(()=> console.log("connected to Database!"))

const app = express();
app.use(express.json())
app.use(cors())

app.get("/helth", async (req: Request, res: Response)=>{
    res.send({ message: "helth" })
})

app.use("/api/my/user", myUserRoute);

app.listen(7000, ()=> {
    console.log("server started on localhost:7000");
})