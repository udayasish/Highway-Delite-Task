import mongoose from "mongoose";
import { INote } from "../types.js";

const noteSchema = new mongoose.Schema<INote>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Note = mongoose.model<INote>("Note", noteSchema);
