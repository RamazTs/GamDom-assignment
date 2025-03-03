import { db } from "../../src/db/db";
import supertest from "supertest";

describe("When user registers", () => {
  it("should return a token and user id and save user info in the database", async () => {
    const response = await supertest(global.app)
      .post("/api/auth/register")
      .send({
        email: "test@test.com",
        password: "testtest123",
      });

    expect(response.status).toBe(201);
    expect(response.body.user_id).toBeDefined();
    expect(response.body.token).toBeDefined();

    const user = await db
      .selectFrom("users")
      .selectAll()
      .where("email", "=", "test@test.com")
      .executeTakeFirst();
    expect(user).toBeDefined();
    expect(user?.email).toBe("test@test.com");
  });

  it("should return a 400 error if the email is invalid", async () => {
    const response = await supertest(global.app)
      .post("/api/auth/register")
      .send({ email: "invalid-email", password: "testtest12" });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("email");
    expect(response.body.message).toContain("Invalid value");
  });

  it("should return a 400 error if the password is invalid", async () => {
    const response = await supertest(global.app)
      .post("/api/auth/register")
      .send({ email: "test@test.com", password: "tes" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(response.body.message).toContain("password");
    expect(response.body.message).toContain("Invalid value");
  });

  it("should return a 400 error if the email is already in use", async () => {
    const response = await supertest(global.app)
      .post("/api/auth/register")
      .send({ email: "test@test.com", password: "testtest123" });

    expect(response.status).toBe(201);

    const response2 = await supertest(global.app)
      .post("/api/auth/register")
      .send({ email: "test@test.com", password: "testtest123" });

    expect(response2.status).toBe(400);
    expect(response2.body.message).toContain("User already exists");
  });
});
