import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { userPublic } from "../utils/serializers.js";

const issueToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const registerPatient = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (
    !name?.trim() ||
    !validator.isEmail(email || "") ||
    !validator.isLength(password || "", { min: 8 })
  ) {
    return res
      .status(400)
      .json({
        message:
          "Enter your name, a valid email, and a password of at least 8 characters.",
      });
  }
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    role: "patient",
    password: await bcrypt.hash(password, 12),
  });
  res.status(201).json({ token: issueToken(user), user: userPublic(user) });
});

export const login = asyncHandler(async (req, res) => {
  const email = (req.body.email || "").toLowerCase();
  const requestedRole = req.body.role || "patient";
  if (!["patient", "doctor", "admin"].includes(requestedRole))
    return res.status(400).json({ message: "Choose a valid account type." });
  const user = await User.findOne({
    email,
    role: requestedRole,
    active: true,
  }).select("+password");
  if (
    !user ||
    !(await bcrypt.compare(req.body.password || "", user.password))
  ) {
    return res
      .status(401)
      .json({
        message: "Email or password is incorrect for this account type.",
      });
  }
  res.json({ token: issueToken(user), user: userPublic(user) });
});

export const getCurrentUser = (req, res) =>
  res.json({ user: userPublic(req.user) });
