import express from "express";

import { getAllProducts, getFeaturedProducts , createProduct , deleteProduct} from "../controllers/product.controllers.js";
import { protectRoute, adminRoute} from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.delete("/", protectRoute, adminRoute, deleteProduct);

export default router;  