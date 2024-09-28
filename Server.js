import express from "express";
import dotenv from "dotenv";

import router from "./routes/auth.route.js";

dotenv.config();



const app = express();
const PORT = process.env.PORT || 4000;


app.use("/api/auth", router)

app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
})