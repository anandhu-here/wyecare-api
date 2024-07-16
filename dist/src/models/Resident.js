"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const MedicationSchema = new mongoose_1.Schema({
    type: String,
    frequency: {
        times: Number,
        per: {
            type: String,
            enum: ["day", "week"],
        },
    },
    label: String,
    medicineName: String,
    timings: [String],
});
const PersonalCareItemSchema = new mongoose_1.default.Schema({
    frequency: {
        times: Number,
        per: {
            type: String,
            enum: ["day", "week"],
        },
    },
    timings: [
        {
            type: mongoose_1.default.Schema.Types.Mixed,
            validate: {
                validator: function (v) {
                    return (typeof v === "string" || (typeof v === "object" && v.day && v.time));
                },
                message: (props) => `${props.value} is not a valid timing!`,
            },
        },
    ],
});
const MealCareItemSchema = new mongoose_1.default.Schema({
    frequency: {
        times: Number,
        per: {
            type: String,
            enum: ["day", "week"],
        },
    },
    defaultTime: String,
});
const PersonalCareSchema = new mongoose_1.default.Schema({
    shower: PersonalCareItemSchema,
    bath: PersonalCareItemSchema,
    breakfast: MealCareItemSchema,
    lunch: MealCareItemSchema,
    dinner: MealCareItemSchema,
    snacks: MealCareItemSchema,
    padCheck: PersonalCareItemSchema,
    fluidIntake: PersonalCareItemSchema,
    sleep: PersonalCareItemSchema,
});
const ResidentSchema = new mongoose_1.Schema({
    homeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Home", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    roomNumber: { type: String, required: true },
    profilePictureUrl: String,
    type: {
        type: String,
        enum: ["Permanent", "Temporary", "Respite"],
        required: true,
    },
    medications: [MedicationSchema],
    personalCare: PersonalCareSchema,
}, { timestamps: true });
exports.default = mongoose_1.default.model("Resident", ResidentSchema);
//# sourceMappingURL=Resident.js.map