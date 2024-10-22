import express from "express";
import { signup , login, logout, refreshToken, getProfile, togglePrivacy, changeName, changePassword} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup );

router.post("/login", login);

router.post("/logout",logout);

router.post("/refresh-token",refreshToken);

router.post("/profile",protectRoute, getProfile);

router.post("/privacy",protectRoute, togglePrivacy);

router.put("/changename",protectRoute, changeName);

router.put("/changepassword",protectRoute, changePassword);


export default router;