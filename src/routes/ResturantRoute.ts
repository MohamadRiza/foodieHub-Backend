import express from "express";
import { param } from "express-validator";
import ResturantController from "../controller/ResturantController";

const router = express.Router();

// api/resturant/search/london
router.get("/search/:city", param("city").isString().trim().notEmpty().withMessage("City Parameter Must be a valid String!"), ResturantController.SearchResturants);

export default router;