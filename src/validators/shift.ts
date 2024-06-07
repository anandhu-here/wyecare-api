import Joi from "joi";

export const createShiftSchema = Joi.object({
  agentId: Joi.string(),
  homeId: Joi.string(),
  assignedUserId: Joi.string(),
  shiftType: Joi.string().required(),
  isCompleted: Joi.boolean().optional(),
  isAccepted: Joi.boolean().optional(),
});
