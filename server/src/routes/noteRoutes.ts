import { Router } from "express";
import {
  getNotes,
  createNote,
  deleteNote,
} from "../controllers/noteController.js";
import { authenticateToken } from "../middleware/auth.js";
import { createNoteSchema, validateRequest } from "../validations.js";

const router = Router();

// Apply authentication middleware to all note routes
router.use(authenticateToken);

// Get user notes
router.get("/", getNotes);

// Create note
router.post("/", validateRequest(createNoteSchema), createNote);

// Delete note
router.delete("/:id", deleteNote);

export default router;
