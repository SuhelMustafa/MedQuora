import bcrypt from "bcrypt";
import validator from "validator";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import asyncHandler from "../utils/asyncHandler.js";
import { doctorPublic } from "../utils/serializers.js";

export const getDashboard = asyncHandler(async (_req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const [
    doctors,
    patients,
    appointments,
    activeAppointments,
    completed,
    recent,
  ] = await Promise.all([
    Doctor.countDocuments({ active: true }),
    User.countDocuments({ role: "patient", active: true }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: "Booked", date: { $gte: today } }),
    Appointment.countDocuments({ status: "Completed" }),
    Appointment.find()
      .populate("patient", "name email")
      .sort({ createdAt: -1 })
      .limit(8),
  ]);
  res.json({
    stats: { doctors, patients, appointments, activeAppointments, completed },
    appointments: recent,
  });
});

export const listDoctors = asyncHandler(async (_req, res) => {
  const doctors = await Doctor.find().sort({ createdAt: -1 });
  res.json({ doctors: doctors.map(doctorPublic) });
});

export const createDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    fees,
    image,
    phone,
    address,
  } = req.body;
  if (
    !name?.trim() ||
    !validator.isEmail(email || "") ||
    !validator.isLength(password || "", { min: 8 }) ||
    !speciality?.trim() ||
    !Number.isFinite(Number(fees)) ||
    Number(fees) < 0
  ) {
    return res
      .status(400)
      .json({
        message:
          "Name, valid email, password (8+ characters), specialty, and fee are required.",
      });
  }
  const doctorEmail = email.toLowerCase();
  if (
    (await User.exists({ email: doctorEmail })) ||
    (await Doctor.exists({ email: doctorEmail }))
  ) {
    return res
      .status(409)
      .json({ message: "An account already uses this email." });
  }
  const user = await User.create({
    name: name.trim(),
    email: doctorEmail,
    password: await bcrypt.hash(password, 12),
    role: "doctor",
    phone,
    address,
  });
  let doctor;
  try {
    doctor = await Doctor.create({
      user: user._id,
      name: name.trim(),
      email: doctorEmail,
      speciality: speciality.trim(),
      degree,
      experience,
      about,
      fees: Number(fees),
      image,
      phone,
      address,
    });
    user.doctorId = doctor._id;
    await user.save();
    res.status(201).json({ doctor: doctorPublic(doctor) });
  } catch (error) {
    if (doctor) await Doctor.findByIdAndDelete(doctor._id);
    await User.findByIdAndDelete(user._id);
    throw error;
  }
});

export const updateDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    speciality,
    degree,
    experience,
    about,
    fees,
    image,
    phone,
    address,
    active,
  } = req.body;
  if (
    fees !== undefined &&
    (!Number.isFinite(Number(fees)) || Number(fees) < 0)
  )
    return res.status(400).json({ message: "Enter a valid consultation fee." });
  if (email !== undefined && !validator.isEmail(email))
    return res.status(400).json({ message: "Enter a valid email." });
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found." });
  const nextEmail = email?.toLowerCase();
  if (
    nextEmail &&
    nextEmail !== doctor.email &&
    ((await User.exists({ email: nextEmail, _id: { $ne: doctor.user } })) ||
      (await Doctor.exists({ email: nextEmail, _id: { $ne: doctor._id } })))
  ) {
    return res
      .status(409)
      .json({ message: "An account already uses this email." });
  }
  const updates = Object.fromEntries(
    Object.entries({
      name,
      email: nextEmail,
      speciality,
      degree,
      experience,
      about,
      image,
      phone,
      address,
      active,
    }).filter(([, value]) => value !== undefined),
  );
  Object.assign(doctor, updates);
  if (fees !== undefined) doctor.fees = Number(fees);
  await doctor.save();
  await User.findByIdAndUpdate(doctor.user, {
    name: doctor.name,
    email: doctor.email,
    phone: doctor.phone,
    address: doctor.address,
    active: doctor.active,
  });
  res.json({ doctor: doctorPublic(doctor) });
});

export const deactivateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true },
  );
  if (!doctor) return res.status(404).json({ message: "Doctor not found." });
  await User.findByIdAndUpdate(doctor.user, { active: false });
  res.json({ message: "Doctor account deactivated." });
});

export const listAppointments = asyncHandler(async (_req, res) => {
  const appointments = await Appointment.find()
    .populate("patient", "name email phone")
    .sort({ date: -1, time: -1 });
  res.json({ appointments });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  if (!["Booked", "Completed", "Cancelled"].includes(req.body.status))
    return res
      .status(400)
      .json({ message: "Choose a valid appointment status." });
  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  ).populate("patient", "name email phone");
  if (!appointment)
    return res.status(404).json({ message: "Appointment not found." });
  res.json({ appointment });
});
