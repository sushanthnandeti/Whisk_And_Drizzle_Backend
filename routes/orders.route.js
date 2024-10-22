import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getOrders} from "../controllers/orders.controller.js"

const router = express.Router();

router.get("/", protectRoute, getOrders );

export default router;