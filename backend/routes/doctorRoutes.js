import { Router } from "express";
import {
  getDashboard,
  listAppointments,
  updateAppointmentStatus,
  updateProfile,
} from "../controllers/doctorController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();
router.use(...requireRoles("doctor"));
router.get("/dashboard", getDashboard);
router.get("/appointments", listAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.put("/profile", updateProfile);
export default router;
