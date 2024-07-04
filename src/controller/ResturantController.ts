import { Request, Response } from "express";
import Resturant from "../models/Resturant";

const SearchResturants = async (req: Request, res: Response)=> {
    try{
        const city = req.params.city;

        const searchQuery = req.query.searchQuery as string || "";
        const selectcuisines = req.query.selectcuisines as string || "";
        const sortOption = req.query.sortOption as string || "lastUpdated";
        const page = parseInt(req.query.page as string) || 1;

        let query: any = {};

        // london = london
        query["city"] = new RegExp(city, "i");
        const cityCheck = await Resturant.countDocuments(query)
        if(cityCheck === 0){
            return res.status(404).json({
                data: [],
                pagination: {
                    total: 0,
                    page: 1,
                    pages: 1,
                }
            });
        }

        if(selectcuisines){
            // URL = selectedcuisines=italian,burger,chinese......
            const cuisinesArray = selectcuisines.split(",").map((cuisine)=> new RegExp(cuisine, "i"));//Chack if this cuisines is correct?
            
            query["cuisines"] = { $all: cuisinesArray };
        }
        if(searchQuery){
            const searchRegex = new RegExp(searchQuery, "i");
            query["$or"] = [
                { resturantName: searchRegex },
                { cuisines: { $in: [searchRegex] } },
            ]
        }
        
        const pageSize = 10;
        const skip = (page - 1) * pageSize;

        const resturant = await Resturant.find(query).sort({ [sortOption]: 1 }).skip(skip).limit(pageSize).lean();

        const total = await Resturant.countDocuments(query);

        const response = {
            data: resturant,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / pageSize),
            },
        }
        res.json(response);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong!" })
    }
};

export default {
    SearchResturants,
}