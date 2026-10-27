import { Router } from "express";
import {
  getCurrentUser,
  login,
  registerPatient,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.post("/register", registerPatient);
router.post("/login", login);
router.get("/me", authenticate, getCurrentUser);
export default router;
