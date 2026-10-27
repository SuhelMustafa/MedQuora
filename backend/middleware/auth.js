import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token)
      return res.status(401).json({ message: "Please sign in to continue." });
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id);
    if (!req.user?.active)
      return res
        .status(401)
        .json({
          message:
            "This account is unavailable. Please contact the administrator.",
        });
    return next();
  } catch {
    return res
      .status(401)
      .json({ message: "Your session has expired. Please sign in again." });
  }
}

export const allowRoles =
  (...roles) =>
  (req, res, next) =>
    roles.includes(req.user.role) ||
    (roles.includes("admin") &&
      req.user.email === process.env.ADMIN_EMAIL?.toLowerCase())
      ? next()
      : res
          .status(403)
          .json({
            message: `This action requires ${roles.join(" or ")} access. Your current account role is ${req.user.role}.`,
          });

export const requireRoles = (...roles) => [authenticate, allowRoles(...roles)];
