import { Response } from "express";
import { Note } from "../models/Note.js";
import { AuthenticatedRequest, CreateNoteRequest } from "../types.js";

// Get user notes
export const getNotes = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const notes = await Note.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Create note
export const createNote = async (
  req: AuthenticatedRequest<{}, {}, CreateNoteRequest>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { title, content } = req.body;

    const note = new Note({
      userId: req.user.userId,
      title,
      content,
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete note
export const deleteNote = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
