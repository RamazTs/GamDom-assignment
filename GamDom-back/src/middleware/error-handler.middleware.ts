import { NextFunction, Request, Response } from "express";
import { ErrorResponseDto } from "../dto/error/http-error-response.dto";
import { HttpError } from "../errors/http-errors";

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!(error instanceof HttpError)) {
    res.status(500).json({ message: "Internal server error" });
    return;
  }
  const errorDto: ErrorResponseDto = {
    message: error.message,
    statusCode: error.statusCode,
  };

  res.status(errorDto.statusCode).json(errorDto);
  return;
}
