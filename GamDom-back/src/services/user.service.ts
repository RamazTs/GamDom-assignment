import { RegisterRequestDto } from "../dto/user/register-request.dto";
import { BadRequestError } from "../errors/http-errors";
import { db } from "../db/db";
import { InsertableUser, User } from "../db/model/user.model";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

async function findUserByEmail(email: string): Promise<User | undefined> {
  return db
    .selectFrom("users")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();
}

async function registerUser({
  email,
  password,
}: RegisterRequestDto): Promise<User> {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  return db
    .insertInto("users")
    .values({
      email,
      password: hashedPassword,
    } satisfies InsertableUser)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export default {
  registerUser,
  findUserByEmail,
};
