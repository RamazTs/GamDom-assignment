import jwt from "jsonwebtoken";
import ms from "ms";
import { appConfig } from "../app-config";

export interface JwtPayload {
  id: string;
}

const generateToken = (user_id: string) => {
  return jwt.sign({ id: user_id } satisfies JwtPayload, appConfig.jwt.secret, {
    expiresIn: appConfig.jwt.expiresIn as ms.StringValue,
  });
};

const verifyToken = (token: string) => {
  return jwt.verify(token, appConfig.jwt.secret) as JwtPayload;
};

export default {
  generateToken,
  verifyToken,
};
