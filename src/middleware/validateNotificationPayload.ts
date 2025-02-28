import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { Error401Exception } from "../exceptions/http.exception";

// Define the schema
const payloadSchema = Joi.object({
  userPrincipalName: Joi.string().email().required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  actions: Joi.array()
    .items(
      Joi.object({
        type: Joi.string().valid("LINK", "REQUEST").required(),
        title: Joi.string().required(),
        url: Joi.string().uri().required(),
        method: Joi.when("type", {
          is: "REQUEST",
          then: Joi.string().valid("GET", "POST", "PUT", "PATCH", "DELETE").required(),
          otherwise: Joi.forbidden()
        }),
        body: Joi.when("type", {
          is: "REQUEST",
          then: Joi.when("method", {
            is: Joi.string().valid("POST", "PUT", "PATCH", "DELETE"),
            then: Joi.object().required(),
            otherwise: Joi.forbidden()
          }),
          otherwise: Joi.forbidden()
        }),
        headers: Joi.when("type", {
          is: "REQUEST",
          then: Joi.object().pattern(Joi.string(), Joi.string()),
          otherwise: Joi.forbidden()
        })
      })
    )
    .required()
});

// Middleware for validation
export const validatePayload = (req: Request, res: Response, next: NextFunction) => {
  const { error } = payloadSchema.validate(req.body, { abortEarly: false });

  if (error) {
    console.error("Error validating payload:", error);
    next(new Error401Exception());
    return;
  }

  next();
};
