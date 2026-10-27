import { Router } from "express";
import {
  createDoctor,
  deactivateDoctor,
  getDashboard,
  listAppointments,
  listDoctors,
  updateAppointmentStatus,
  updateDoctor,
} from "../controllers/adminController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();
router.use(...requireRoles("admin"));
router.get("/dashboard", getDashboard);
router.get("/doctors", listDoctors);
router.post("/doctors", createDoctor);
router.put("/doctors/:id", updateDoctor);
router.delete("/doctors/:id", deactivateDoctor);
router.get("/appointments", listAppointments);
router.patch("/appointments/:id/status", updateAppointmentStatus);
export default router;
