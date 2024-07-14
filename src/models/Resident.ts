import mongoose, { Schema } from "mongoose";
import { IResident } from "src/interfaces/entities/resident";

const PersonalCareItemSchema = new Schema({
  frequency: {
    times: { type: Number, required: true },
    per: { type: String, enum: ["day", "week"], required: true },
  },
});

const MealCareItemSchema = new Schema({
  frequency: {
    times: { type: Number, required: true },
    per: { type: String, enum: ["day", "week"], required: true },
  },
  defaultTime: { type: String, required: true }, // HH:mm format
});

const PersonalCareSchema = new Schema({
  shower: PersonalCareItemSchema,
  bath: PersonalCareItemSchema,
  breakfast: MealCareItemSchema,
  lunch: MealCareItemSchema,
  dinner: MealCareItemSchema,
  snacks: PersonalCareItemSchema,
  padCheck: PersonalCareItemSchema,
  fluidIntake: PersonalCareItemSchema,
  sleep: PersonalCareItemSchema,
});

const CareTimelineEntrySchema = new Schema({
  carerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  careType: { type: String, required: true },
  details: { type: Schema.Types.Mixed, required: true },
  time: { type: Date, default: Date.now },
});

const MedicationTimelineEntrySchema = new Schema({
  medicationId: {
    type: Schema.Types.ObjectId,
    ref: "Medication",
    required: true,
  },
  nurseId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  time: { type: Date, default: Date.now },
});

const ResidentSchema = new Schema(
  {
    homeId: { type: Schema.Types.ObjectId, ref: "Home", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    profilePictureUrl: { type: String },
    type: { type: String, required: true },
    careTimeline: [CareTimelineEntrySchema],
    medicationsTimeline: [MedicationTimelineEntrySchema],
    personalCare: PersonalCareSchema,
  },
  { timestamps: true }
);

export default mongoose.model<IResident>("Resident", ResidentSchema);
