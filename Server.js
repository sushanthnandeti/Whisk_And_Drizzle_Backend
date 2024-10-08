    import express from "express";
    import dotenv from "dotenv";
    import cookieParser from "cookie-parser";
    import cors from "cors";
    import authRoutes from "./routes/auth.route.js";
    import productRoutes from "./routes/product.route.js";
    import cartRoutes from "./routes/cart.route.js";
    import couponRoutes from "./routes/coupon.route.js";
    import paymentRoute from "./routes/payment.route.js";
    import analyticsRoute from "./routes/analytics.route.js";

    import {connectDB} from "./lib/db.js";


    const app = express();

    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
        origin: 'http://localhost:5173',  // your frontend URL
        credentials: true,                 // allow credentials (cookies, etc.)
      }));
      

    dotenv.config();
    

    const PORT = process.env.PORT || 4000;

    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/coupons", couponRoutes);
    app.use("/api/payments", paymentRoute);
    app.use("/api/analytics", analyticsRoute);

    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
        connectDB();
    })