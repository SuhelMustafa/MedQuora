import { Router } from "express";
import {
  bookAppointment,
  cancelAppointment,
  listAppointments,
  updateProfile,
} from "../controllers/patientController.js";
import { requireRoles } from "../middleware/auth.js";

const router = Router();
router.put("/users/me", ...requireRoles("patient"), updateProfile);
router.get("/appointments", ...requireRoles("patient"), listAppointments);
router.post("/appointments", ...requireRoles("patient"), bookAppointment);
router.patch(
  "/appointments/:id/cancel",
  ...requireRoles("patient"),
  cancelAppointment,
);
export default router;
