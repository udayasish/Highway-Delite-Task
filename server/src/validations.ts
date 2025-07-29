import { z } from "zod";
import { Request, Response, NextFunction } from "express";

// User registration validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  dateOfBirth: z
    .string()
    .regex(
      /^\d{2}\/\d{2}\/\d{4}$/,
      "Date of birth must be in DD/MM/YYYY format"
    )
    .refine((date: string) => {
      const [day, month, year] = date.split("/");
      if (!day || !month || !year) return false;
      const birthDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 13;
      }
      return age >= 13;
    }, "You must be at least 13 years old"),
});

// OTP verification validation schema
export const verifyOTPSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

// Send OTP validation schema
export const sendOTPSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
});

// Login validation schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
});

// Note creation validation schema
export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content must be less than 1000 characters")
    .trim(),
});

// Validation middleware
export const validateRequest = <T extends z.ZodSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = (error as any).errors.map((err: z.ZodIssue) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          error: "Validation failed",
          details: errors,
          message: errors[0]?.message || "Invalid input data",
        });
        return;
      }

      res.status(400).json({
        error: "Invalid request data",
        message: "Please check your input and try again",
      });
    }
  };
};
