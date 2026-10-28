import { Router } from "express";
import {
  chatDoctorGuide,
  getDoctorAvailability,
  listActiveDoctors,
} from "../controllers/publicDoctorController.js";

const router = Router();
router.get("/doctors", listActiveDoctors);
router.post("/doctor-guide/chat", chatDoctorGuide);
router.get("/doctors/:doctorId/availability", getDoctorAvailability);
export default router;
