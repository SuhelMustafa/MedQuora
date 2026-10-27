import { Router } from "express";
import {
  getDoctorAvailability,
  listActiveDoctors,
} from "../controllers/publicDoctorController.js";

const router = Router();
router.get("/doctors", listActiveDoctors);
router.get("/doctors/:doctorId/availability", getDoctorAvailability);
export default router;
