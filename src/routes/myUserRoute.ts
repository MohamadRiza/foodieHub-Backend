import express from "express";
import myUserController from "../controller/myUserController";
import { jwtCheck, jwtParse } from "../MiddleWare/Auth";
import { validatemyUserRequest } from "../MiddleWare/validation";

const router = express.Router();
router.get("/", jwtCheck, jwtParse, myUserController.getcurrentUser)
router.post("/", jwtCheck, myUserController.createCurrentUser)
router.put("/", jwtCheck, jwtParse, validatemyUserRequest, myUserController.updatecurrentUser)

export default router;