import mongoose from "mongoose";
import { Hospital } from "./hospital.models";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
    },
  },
  { timestamps: true },
);

export const Patient = mongoose.model("Patient", patientSchema);
