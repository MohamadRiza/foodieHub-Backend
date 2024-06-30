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