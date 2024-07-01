import express from "express";
import multer from "multer";
import myResturantController from "../controller/myResturantController";
import { jwtCheck, jwtParse } from "../MiddleWare/Auth";
import { validatemyResturantRequest } from "../MiddleWare/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //5mb
    }
})

//api/my/resturant
router.post("/", upload.single("imageFile"), validatemyResturantRequest, jwtCheck, jwtParse, myResturantController.createMyResturant)

export default router;