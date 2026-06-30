import mongoose from "mongoose";

const workinghoursSchema = new mongoose.Schema({
  hospitalName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital",
    required: true,
  },
  workingHours: {
    type: String,
    required: true,
  },
});

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hospital: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
      },
    ],

    salary: {
      type: Number,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    experiance: {
      type: Number,
      default: 0,
    },
    workingHours: {
      type: [workinghoursSchema],
    },
  },
  { timestamps: true },
);

export const Doctor = mongoose.model("Doctor", doctorSchema);
