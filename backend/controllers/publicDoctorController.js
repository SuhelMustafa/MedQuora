import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import sampleDoctors from "../data/sampleDoctors.js";
import asyncHandler from "../utils/asyncHandler.js";
import { doctorPublic } from "../utils/serializers.js";

export const listActiveDoctors = asyncHandler(async (_req, res) => {
  const doctors = await Doctor.find({ active: true }).sort({ name: 1 });
  res.json({ doctors: doctors.map(doctorPublic) });
});

export const chatDoctorGuide = asyncHandler(async (req, res) => {
  const message = typeof req.body?.message === "string"
    ? req.body.message.trim()
    : "";
  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  if (!message || message.length > 1200) {
    return res.status(400).json({
      message: "Enter a message under 1,200 characters.",
    });
  }
  if (
    history.length > 12 ||
    history.some(
      (item) =>
        !["user", "assistant"].includes(item?.role) ||
        typeof item?.content !== "string" ||
        item.content.length > 1200,
    )
  ) {
    return res.status(400).json({ message: "Chat history is invalid." });
  }

  const webhookUrl = process.env.N8N_DOCTOR_GUIDE_WEBHOOK_URL;
  if (!webhookUrl) {
    return res.status(503).json({
      message: "The doctor guide chat is not configured yet. Please browse doctors by specialty.",
    });
  }

  const managedDoctors = await Doctor.find({ active: true })
    .select("name speciality image experience fees")
    .sort({ name: 1 });
  const doctors = [
    ...managedDoctors.map((doctor) => ({
      id: String(doctor._id),
      name: doctor.name,
      speciality: doctor.speciality,
      image: doctor.image,
      experience: doctor.experience,
      fees: doctor.fees,
    })),
    ...Object.entries(sampleDoctors).map(([id, doctor]) => ({
      id,
      ...doctor,
      image: "",
      experience: "",
    })),
  ];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_DOCTOR_GUIDE_TOKEN
          ? { Authorization: `Bearer ${process.env.N8N_DOCTOR_GUIDE_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        message,
        history: history.slice(-12),
        specialties: [...new Set(doctors.map((doctor) => doctor.speciality))],
        doctors,
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`n8n returned ${response.status}`);
    const result = await response.json();
    const payload = Array.isArray(result) ? result[0]?.json ?? result[0] : result;
    const reply = payload?.reply ?? payload?.output ?? payload?.text;
    if (typeof reply !== "string" || !reply.trim())
      throw new Error("n8n response did not include a reply");
    const recommendedSpecialties = Array.isArray(payload.recommendedSpecialties)
      ? payload.recommendedSpecialties
          .filter((specialty) => typeof specialty === "string")
          .filter((specialty) => doctors.some((doctor) => doctor.speciality === specialty))
          .slice(0, 3)
      : [];
    res.json({ reply: reply.trim().slice(0, 5000), recommendedSpecialties });
  } catch (error) {
    console.error("Doctor guide n8n request failed:", error.message);
    res.status(502).json({
      message: "The doctor guide is temporarily unavailable. Please browse doctors by specialty.",
    });
  } finally {
    clearTimeout(timeout);
  }
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
