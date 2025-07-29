import { Request } from "express";
import { Document, Types } from "mongoose";

// User interface
export interface IUser extends Document {
  name: string;
  email: string;
  dateOfBirth: string;
  isEmailVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Note interface
export interface INote extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// JWT payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Extended Request interface with user
export interface AuthenticatedRequest<P = any, ResBody = any, ReqBody = any>
  extends Request<P, ResBody, ReqBody> {
  user?: JWTPayload;
  body: ReqBody;
  params: P;
  headers: any;
}

// Validation schemas
export interface RegisterRequest {
  name: string;
  email: string;
  dateOfBirth: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
}

export interface SendOTPRequest {
  email: string;
}

export interface LoginRequest {
  email: string;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
}

// API Response interfaces
export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface ValidationError {
  field: string;
  message: string;
}
