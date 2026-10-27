import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Appointment from "../models/Appointment.js";
import asyncHandler from "../utils/asyncHandler.js";
import { doctorPublic, userPublic } from "../utils/serializers.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ _id: req.user.doctorId, active: true });
  if (!doctor)
    return res.status(404).json({ message: "Doctor profile not found." });
  const doctorId = String(doctor._id);
  const today = new Date().toISOString().slice(0, 10);
  const [appointments, appointmentCount, bookedCount, completed, patients] =
    await Promise.all([
      Appointment.find({ doctorId })
        .populate("patient", "name email phone")
        .sort({ date: -1, time: -1 })
        .limit(8),
      Appointment.countDocuments({ doctorId }),
      Appointment.countDocuments({
        doctorId,
        status: "Booked",
        date: { $gte: today },
      }),
      Appointment.find({ doctorId, status: "Completed" }).select("fees"),
      Appointment.distinct("patient", { doctorId }),
    ]);
  res.json({
    doctor: doctorPublic(doctor),
    stats: {
      appointments: appointmentCount,
      upcoming: bookedCount,
      patients: patients.length,
      earnings: completed.reduce((sum, item) => sum + item.fees, 0),
    },
    appointments,
  });
});

export const listAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    doctorId: String(req.user.doctorId),
  })
    .populate("patient", "name email phone")
    .sort({ date: -1, time: -1 });
  res.json({ appointments });
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["Completed", "Cancelled"].includes(status))
    return res
      .status(400)
      .json({ message: "Choose a valid appointment status." });
  const appointment = await Appointment.findOneAndUpdate(
    {
      _id: req.params.id,
      doctorId: String(req.user.doctorId),
      status: "Booked",
    },
    { status },
    { new: true },
  ).populate("patient", "name email phone");
  if (!appointment)
    return res
      .status(404)
      .json({ message: "Appointment was not found or is already updated." });
  res.json({ appointment });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    address,
    image,
    speciality,
    degree,
    experience,
    about,
    fees,
  } = req.body;
  if (
    !name?.trim() ||
    !speciality?.trim() ||
    !Number.isFinite(Number(fees)) ||
    Number(fees) < 0
  ) {
    return res
      .status(400)
      .json({
        message: "Name, specialty, and a valid consultation fee are required.",
      });
  }
  const doctor = await Doctor.findByIdAndUpdate(
    req.user.doctorId,
    {
      name: name.trim(),
      phone,
      address,
      image,
      speciality: speciality.trim(),
      degree,
      experience,
      about,
      fees: Number(fees),
    },
    { new: true, runValidators: true },
  );
  if (!doctor)
    return res.status(404).json({ message: "Doctor profile not found." });
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name: doctor.name, phone, address },
    { new: true },
  );
  res.json({ doctor: doctorPublic(doctor), user: userPublic(updatedUser) });
});
