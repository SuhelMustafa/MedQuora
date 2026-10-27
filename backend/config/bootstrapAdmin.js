import bcrypt from "bcrypt";
import User from "../models/User.js";

export default async function bootstrapAdmin() {
  const {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_NAME = "MedQuora Admin",
  } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD)
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required in backend/.env",
    );
  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    // The configured bootstrap identity is the source of truth for the admin
    // role. This also repairs databases where that email was first registered
    // as a patient before admin credentials were configured.
    if (existing.role === "patient") {
      existing.role = "admin";
      existing.active = true;
      existing.password = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await existing.save();
    } else if (existing.role !== "admin") {
      throw new Error("ADMIN_EMAIL is already used by a doctor account.");
    }
    return;
  }
  await User.create({
    name: ADMIN_NAME,
    email,
    role: "admin",
    password: await bcrypt.hash(ADMIN_PASSWORD, 12),
  });
}
