import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import redis from "ioredis";


const generateTokens = (userId) => {

    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET , {
        expiresIn: "7d",
});

    return {accessToken, refreshToken}
}

const storeRefreshTokens = async(userId, refreshToken)  => {
   await redis.set(`refresh_token: ${userId}`, refreshToken, "EX", 7*24*60*60); // 7 DAYS
}

// Setcookies function
const setCookies = (res, accessToken, refreshToken) => { 
        
        res.cookie("accessToken", accessToken, 
        { 
        httpOnly: true,                     //prevent XSS attackts
        secure: process.env.NODE_ENV === "production", 
        samsite: "strict",                  // prevent CSRF attacks, cross-site request forgery attack
        maxAge : 15 * 60 * 1000,            //   15 mins
        })

        res.cookie("refreshToken", refreshToken, 
        { 
        httpOnly: true,                     //prevent XSS attackts
        secure: process.env.NODE_ENV === "production", 
        samsite: "strict",                  // prevent CSRF attacks, cross-site request forgery attack
        maxAge : 15 * 60 * 1000,            //   15 mins
        })
    }


export const signup =  async (req,res) => {
    const { email, password, name} = req.body;
    
    try {
         const userExists = await User.findOne({ email });

    if (userExists){
        return res.status(400).json({message: "User already exists"});
    }
    const user = await User.create({ name, email, password});

    //authenticate
    const {accessToken, refreshToken} = generateTokens(user._id)
    await storeRefreshTokens(user._id, refreshToken)
    setCookies(res, accessToken, refreshToken);

    res.status(201).json({ user : {
            _id: user._id, 
            name: user.name,
            email: user.email, 
            role: user.role
        }, message : "User Created Successfully"});
    } 
    catch (error) {
        res.status(500).json({ message: error.message})      
    }
};

export const login =  async (req,res) => {
    res.send("login up Called");
}
export const logout =  async (req,res) => {
    res.send("logout up Called");
}
