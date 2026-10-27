import mongoose from "mongoose";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import sampleDoctors from "../data/sampleDoctors.js";
import asyncHandler from "../utils/asyncHandler.js";
import { userPublic } from "../utils/serializers.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, gender, dob } = req.body;
  if (!name?.trim())
    return res.status(400).json({ message: "Name is required." });
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name: name.trim(), phone, address, gender, dob },
    { new: true, runValidators: true },
  );
  res.json({ user: userPublic(user) });
});

export const listAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ patient: req.user._id }).sort({
    date: 1,
    time: 1,
  });
  res.json({ appointments });
});

export const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, doctorName, doctorImage, speciality, fees, date, time } =
    req.body;
  const parsedDate = new Date(`${date}T00:00:00.000Z`);
  const validDate =
    /^\d{4}-\d{2}-\d{2}$/.test(date || "") &&
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date;
  const validTime = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
  ].includes(time);
  if (
    !doctorId ||
    !validDate ||
    !validTime ||
    new Date(`${date}T${time}:00`) <= new Date()
  ) {
    return res
      .status(400)
      .json({ message: "Choose a valid doctor, date, and time." });
  }
  let details;
  if (mongoose.isValidObjectId(doctorId)) {
    const doctor = await Doctor.findOne({ _id: doctorId, active: true });
    if (!doctor)
      return res
        .status(404)
        .json({ message: "This doctor is no longer available." });
    details = {
      doctorId: String(doctor._id),
      doctorName: doctor.name,
      doctorImage: doctor.image,
      speciality: doctor.speciality,
      fees: doctor.fees,
      doctor: doctor._id,
    };
  } else {
    const sampleDoctor = sampleDoctors[doctorId];
    if (!sampleDoctor)
      return res.status(404).json({ message: "Doctor not found." });
    details = {
      doctorId,
      doctorName: sampleDoctor.name,
      doctorImage,
      speciality: sampleDoctor.speciality,
      fees: sampleDoctor.fees,
      doctor: null,
    };
  }
  if (
    !details.doctorName ||
    !details.speciality ||
    !Number.isFinite(details.fees) ||
    details.fees < 0
  ) {
    return res.status(400).json({ message: "Doctor details are invalid." });
  }
  try {
    const appointment = await Appointment.create({
      patient: req.user._id,
      ...details,
      date,
      time,
    });
    res.status(201).json({ appointment });
  } catch (error) {
    if (error.code === 11000)
      return res
        .status(409)
        .json({
          message: "That time was just booked. Please choose another slot.",
        });
    throw error;
  }
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, patient: req.user._id, status: "Booked" },
    { status: "Cancelled" },
    { new: true },
  );
  if (!appointment)
    return res
      .status(404)
      .json({ message: "Appointment was not found or is already cancelled." });
  res.json({ appointment });
});
