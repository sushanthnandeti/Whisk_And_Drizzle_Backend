import express from "express";

import { getAllProducts, getFeaturedProducts , createProduct , deleteProduct , getRecommendedProducts , getProductsByCategory , toggleFeaturedProduct} from "../controllers/product.controllers.js";
import { protectRoute, adminRoute} from "../middleware/auth.middleware.js";


const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);


export default router;  