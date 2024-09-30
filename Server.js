import express from "express";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.route.js";
import {connectDB} from "./lib/db.js";

const app = express();
app.use(express.json());


dotenv.config();
 

const PORT = process.env.PORT || 4000;

app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
    connectDB();
})