import { StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { ValidationError, type FieldErrors } from "../util/error";

interface RequestSchemas {
  body?: z.ZodObject<any, any>;
  params?: z.ZodObject<any, any>;
  query?: z.ZodObject<any, any>;
}

export function validateData(schemas: RequestSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) schemas.body.parse(req.body);
      if (schemas.params) schemas.params.parse(req.params);
      if (schemas.query) schemas.query.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errorMessages: FieldErrors = z.flattenError(err).fieldErrors;
        next(new ValidationError(errorMessages));
      } else {
        next(err);
      }
    }
  };
}
