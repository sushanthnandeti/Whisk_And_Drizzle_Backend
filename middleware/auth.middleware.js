import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async (req, res) => {

    try {
        
        const accessToken = req.accessToken; 

        if(!accessToken) {


            return res.status(401).json({message : "Unauthorized User"});
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if (user) {
                return res.status(401).json({message : "User not Found"})
            }

            req.user = user;
            next();

        } catch (error) {
            if(error.name === "TokenExpiredError") { 
                return res.status(401).json({message: "Unauthorized - Invalid access Token"});
            }
            
        }
        
    } catch (error) {

        console.log("Error in protectRoute middleware", error.message);
        return res.status(401).json({message : "Unauthorized - Invalid access Token"})
        
    }
}


export const adminRoute = async() => {

    if (req.user && req.user.role === 'admin'){ 
        console.log('Test1');
        next();
    }
    else {
        return res.status(401).json({message : "Access Denied - Admins Only"})
    }
};