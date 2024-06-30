import mongoose from "mongoose";

const userschema = new mongoose.Schema({
    auth0Id: {
        type: String,
        requeired: true,
    },
    email: {
        type: String,
        requeired: true,
    },
    name:{
        type: String,
    },
    addressLine1:{
        type: String,
    },
    city:{
        type: String,
    },
    country:{
        type: String,
    },
});

const User = mongoose.model("user", userschema);
export default User;