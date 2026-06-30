import mongoose from "mongoose";

const medicalReportSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },
    report: {   
        type: String,
        required: true,
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: true,
    },
    fees: {
        type: Number,
        default: 0,
    }
},{timestamps: true});

export const MedicalReport = mongoose.model("MedicalReport", medicalReportSchema)