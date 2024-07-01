import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = async (req: Request, res: Response, next: NextFunction)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validatemyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name Must be String"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a String"),
    body("city").isString().notEmpty().withMessage("city must be a string"),
    body("country").isString().notEmpty().withMessage("country must be a string"),
    handleValidationErrors,
]

export const validatemyResturantRequest = [
    body("resturantName").notEmpty().withMessage("Resturant Name is Requeired!"),
    body("city").notEmpty().withMessage("City is Requeired!"),
    body("country").notEmpty().withMessage("Country is Requeired!"),
    body("deliveryPrice").isFloat({ min: 0 }).withMessage("Delivery Price must be a positive Number!"),
    body("estimateDeliveryTime").isInt({ min: 0 }).withMessage("Estimate delivery time is must be a positive integer!"),
    body("cuisines").isArray().withMessage("cuisines must be a Array!").not().isEmpty().withMessage("cuisines array cannot be empty"),
    body("menueItems").isArray().withMessage("menueItems must be an array!"),
    body("menueItems.*.name").notEmpty().withMessage("menueItems name is requeired!"),
    body("menueItems.*.price").isFloat({ min: 0 }).withMessage("menueItems Price is requeired and must be a positive number!"),
    handleValidationErrors,
]