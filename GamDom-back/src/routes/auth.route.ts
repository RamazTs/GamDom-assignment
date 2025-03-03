import { Router } from "express";
import { RegisterRequestDto } from "../dto/user/register-request.dto";
import { Request, Response } from "express";
import { body } from "express-validator";
import { validateDto } from "../middleware/dto-validation.middleware";
import { LoginRequestDto } from "../dto/user/login-request.dto";
import UserService from "../services/user.service";
import AuthService from "../services/auth.service";
import { BadRequestError } from "../errors/http-errors";
import bcrypt from "bcrypt";
import { LoginResponseDto } from "../dto/user/login-response.dto";
import { RegisterResponseDto } from "../dto/user/register-response.dto";

const router = Router();

router.post(
  "/login",
  body("email").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  body("password").isLength({ min: 8, max: 32 }),
  validateDto,
  async (
    req: Request<{}, {}, LoginRequestDto>,
    res: Response<LoginResponseDto>
  ) => {
    const dto = req.body;
    const user = await UserService.findUserByEmail(dto.email);

    if (!user) {
      throw new BadRequestError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestError("Invalid email or password");
    }

    const token = AuthService.generateToken(user.id.toString());

    res.status(200).json({ user_id: user.id, email: user.email, token });
    return;
  }
);

router.post(
  "/register",
  body("email").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  body("password").isLength({ min: 8, max: 32 }),
  validateDto,
  async (
    req: Request<{}, {}, RegisterRequestDto>,
    res: Response<RegisterResponseDto>
  ) => {
    const dto = req.body;
    const user = await UserService.registerUser(dto);
    const token = AuthService.generateToken(user.id.toString());

    res.status(201).json({ user_id: user.id, email: user.email, token });
    return;
  }
);

export default router;
