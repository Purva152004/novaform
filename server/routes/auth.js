import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();
const cookieName = process.env.COOKIE_NAME || "ai_forms_token";

const credentialsSchema = z.object({
  name: z.string().trim().max(80).optional().default(""),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100)
});

const signToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

const setSessionCookie = (res, token) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = credentialsSchema.parse(req.body);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = signToken(user);

    setSessionCookie(res, token);

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = credentialsSchema.omit({ name: true }).parse(req.body);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const matches = await bcrypt.compare(password, user.password);

    if (!matches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    setSessionCookie(res, token);

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan
      }
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
  return res.json({ message: "Logged out." });
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("_id name email plan createdAt");

  if (!user) {
    return res.status(401).json({ message: "Session is no longer valid. Please log in again." });
  }

  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      createdAt: user.createdAt
    }
  });
});


export default router;
