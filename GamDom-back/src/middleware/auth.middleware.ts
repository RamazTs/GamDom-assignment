import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { UnauthorizedError } from "../errors/http-errors";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export function authMiddleware(req: Request, _: Response, next: NextFunction) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  ) {
    throw new UnauthorizedError("Authorization header is required");
  }
  const token = req.headers.authorization.split(" ")[1];

  const decoded = AuthService.verifyToken(token) as JwtPayload;
  if (!decoded) {
    throw new UnauthorizedError("Invalid token");
  }

  req.user = { id: decoded.id };

  return next();
}
