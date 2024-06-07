import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

export const validateShiftRequest =
  (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({ error: errorMessage });
    }
    next();
  };
