import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {redis} from "../lib/redis.js";


const generateTokens = (userId) => {

    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET , {
        expiresIn: "7d",
});

    return {accessToken, refreshToken}
}

const storeRefreshToken = async(userId, refreshToken)  => {
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


// Signup Logic

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
    await storeRefreshToken(user._id, refreshToken)
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


// Login Logic
export const login =  async (req,res) => {
    
    try {
        console.log(req.body)
        const {email, password} = req.body;
        console.log(req.body)
        const user = await User.findOne({email});
        console.log("Execution done")
        console.log(user);
        console.log("Execution done again")
        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken} = generateTokens(user._id);
            await storeRefreshToken(user._id, refreshToken);
            setCookies(res, accessToken, refreshToken);

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });

        } else { 
            res.status(401).json({message: "Invalid Email or Password"});
        }
        
    } catch (error) { 
        console.log("Error in login", error.message);
        res.status(500).json({message: error.message});
    }
}


// Logout Logic
export const logout =  async (req,res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token: ${decoded.userId}`);   
        }
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json("Logged out Successfully");
    } catch (error) {
        res.status(500).json({message : "Server Error", error: error_message});
    }
}


// Refresh Token Logic 

export const refreshToken = async(req, res) => {

    try {

        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) {

            return res.status(401).json({message: "No refresh token found"});
        }
    
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refresh_token: ${decoded.userId}`);   

        if(storedToken !== refreshToken){
            return res.status(401).json({message: "Invalid Refresh Token"});
        }
        
        const accessToken = jwt.sign({userId : decoded.userId}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m", });


        res.cookie("accessToken", accessToken, 
        { 
        httpOnly: true,                     //prevent XSS attackts
        secure: process.env.NODE_ENV === "production", 
        samsite: "strict",                  // prevent CSRF attacks, cross-site request forgery attack
        maxAge : 15 * 60 * 1000,            //   15 mins
        })

        res.json({message: "Token Refresh Successfully!"})
  
    } catch (error) {

        console.log("Error in refreshToken controller", error.message);
        res.status(500).json({message: "Server Error", error : error.message});
        
    };
}

export const getProfile = async(req,res) => {

    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({message : "Server Error", error: error.message})
    }
}