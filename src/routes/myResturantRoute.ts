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
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.get(
  "/order",
  jwtCheck,
  jwtParse,
  myResturantController.getMyResturantOrders
);

router.patch("/order/:orderId/status", jwtCheck, jwtParse, myResturantController.updateOrderStatus)

//GET api/my/resturant
router.get("/", jwtCheck, jwtParse, myResturantController.getMyResturant);

//api/my/resturant
router.post(
  "/",
  upload.single("imageFile"),
  validatemyResturantRequest,
  jwtCheck,
  jwtParse,
  myResturantController.createMyResturant
);

router.put(
  "/",
  upload.single("imageFile"),
  validatemyResturantRequest,
  jwtCheck,
  jwtParse,
  myResturantController.updateMyResturant
);

export default router;
