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
    import ordersRoute from "./routes/orders.route.js";
    import path from "path";

    import {connectDB} from "./lib/db.js";


    const app = express();

    const __dirname = path.resolve()

    app.use(express.json({limit : "10mb"})); //allows you to parse the body of the request
    app.use(cookieParser());
    app.use(cors({
        origin: 'http://localhost:5173',  // your frontend URL
        //origin: 'http://54.174.173.52:8080',
        credentials: true,                 // allow credentials (cookies, etc.)
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }));
      

    dotenv.config();
    

    const PORT = process.env.PORT || 4000;

    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/coupons", couponRoutes);
    app.use("/api/payments", paymentRoute);
    app.use("/api/analytics", analyticsRoute);
    app.use("/api/orders", ordersRoute);

    if(process.env.NODE_ENV == "production") {
      
      app.use(express.static(path.join(__dirname, "/frontend/dist")))
      
      app.get("*", (req,res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
      });
    }

    

    app.listen(PORT, () => {
        console.log(`Server is running on Port ${PORT}`);
        connectDB();
    })