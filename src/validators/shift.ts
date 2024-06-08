import Joi from "joi";
import { ObjectId, Types } from "mongoose";

// Custom validation for ObjectId
const objectIdValidator = (value: any, helpers: Joi.CustomHelpers) => {
  if (!Types.ObjectId.isValid(value)) {
    return helpers.message({ custom: '"{{#label}}" must be a valid ObjectId' });
  }
  return value;
};

export const createShiftSchema = Joi.object({
  agentId: Joi.string().custom(objectIdValidator).required(),
  homeId: Joi.string().custom(objectIdValidator).optional(),
  isAccepted: Joi.boolean().optional(),
  isCompleted: Joi.boolean().optional(),
  shiftType: Joi.string().custom(objectIdValidator).required(),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});
