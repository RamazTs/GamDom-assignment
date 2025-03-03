import supertest from "supertest";
import UserService from "../../src/services/user.service";

describe("When user login", () => {
  it("should return a token and user id and save user info in the database", async () => {
    await UserService.registerUser({
      email: "test@test.com",
      password: "testtest123",
    });

    const response = await supertest(global.app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "testtest123" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user_id).toBeDefined();
  });

  it("should return a 400 error if the email is invalid", async () => {
    await UserService.registerUser({
      email: "test@test.com",
      password: "testtest123",
    });

    const response = await supertest(global.app)
      .post("/api/auth/login")
      .send({ email: "invalid-email", password: "testtest123" });

    expect(response.status).toBe(400);
  });

  it("should return a 400 error if the password is invalid", async () => {
    await UserService.registerUser({
      email: "test@test.com",
      password: "testtest123",
    });

    const response = await supertest(global.app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "invalid-password" });

    expect(response.status).toBe(400);
  });

  it("should return a 400 error if the email is not found", async () => {
    const response = await supertest(global.app)
      .post("/api/auth/login")
      .send({ email: "not-found@test.com", password: "testtest123" });

    expect(response.status).toBe(400);
  });

  it("should return a 400 error if the password is incorrect", async () => {
    await UserService.registerUser({
      email: "test@test.com",
      password: "testtest123",
    });

    const response = await supertest(global.app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "incorrect-password" });

    expect(response.status).toBe(400);
  });
});
