import { Router } from "express";
import {
  register,
  sendOTP,
  verifyOTP,
  login,
} from "../controllers/authController.js";
import {
  registerSchema,
  verifyOTPSchema,
  sendOTPSchema,
  loginSchema,
  validateRequest,
} from "../validations.js";

const router = Router();

// Register user
router.post("/register", validateRequest(registerSchema), register);

// Send OTP for login
router.post("/send-otp", validateRequest(sendOTPSchema), sendOTP);

// Verify OTP
router.post("/verify-otp", validateRequest(verifyOTPSchema), verifyOTP);

// Login
router.post("/login", validateRequest(loginSchema), login);

export default router;
