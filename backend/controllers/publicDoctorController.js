import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import sampleDoctors from "../data/sampleDoctors.js";
import asyncHandler from "../utils/asyncHandler.js";
import { doctorPublic } from "../utils/serializers.js";

export const listActiveDoctors = asyncHandler(async (_req, res) => {
  const doctors = await Doctor.find({ active: true }).sort({ name: 1 });
  res.json({ doctors: doctors.map(doctorPublic) });
});

export const getDoctorAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date || "") ||
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== date
  ) {
    return res
      .status(400)
      .json({ message: "Choose a valid appointment date." });
  }
  const { doctorId } = req.params;
  if (
    /^[a-f\d]{24}$/i.test(doctorId) &&
    !(await Doctor.exists({ _id: doctorId, active: true }))
  ) {
    return res.status(404).json({ message: "Doctor not found." });
  }
  if (!/^[a-f\d]{24}$/i.test(doctorId) && !sampleDoctors[doctorId])
    return res.status(404).json({ message: "Doctor not found." });
  const appointments = await Appointment.find({
    doctorId,
    date,
    status: "Booked",
  }).select("time -_id");
  res.json({ bookedTimes: appointments.map((item) => item.time) });
});
