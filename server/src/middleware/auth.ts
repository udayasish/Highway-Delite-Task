import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWTPayload, AuthenticatedRequest } from "../types.js";

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  jwt.verify(
    token,
    process.env["JWT_SECRET"] || "your-secret-key",
    (err, user) => {
      if (err) {
        res.status(403).json({ error: "Invalid token" });
        return;
      }
      req.user = user as JWTPayload;
      next();
    }
  );
};
