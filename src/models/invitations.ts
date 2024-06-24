import mongoose, { Schema } from "mongoose";
import { IJoinInvitation } from "src/interfaces/entities/invitations";

const JoinInvitationSchema: Schema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    companyName: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJoinInvitation>(
  "JoinInvitation",
  JoinInvitationSchema
);
