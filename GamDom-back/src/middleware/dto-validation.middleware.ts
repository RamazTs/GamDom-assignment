import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../errors/http-errors";

export function validateDto(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new BadRequestError(
        JSON.stringify(errors.array({ onlyFirstError: true })[0])
      )
    );
  }
  return next();
}
