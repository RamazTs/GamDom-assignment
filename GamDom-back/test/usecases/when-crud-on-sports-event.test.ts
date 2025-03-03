import supertest from "supertest";
import { db } from "../../src/db/db";
import AuthService from "../../src/services/auth.service";

describe("When crud on sports event", () => {
  it("should create a sports event", async () => {
    // given
    const token = AuthService.generateToken("1");

    // when
    const response = await supertest(global.app)
      .post("/api/events")
      .send({
        event_name: "test",
        odds: "1.00",
      })
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(201);
    expect(response.body.event_name).toBe("test");
    expect(response.body.odds).toBe("1.00");
    const event = await db
      .selectFrom("sports_events")
      .selectAll()
      .where("event_id", "=", response.body.event_id)
      .executeTakeFirstOrThrow();
    expect(event.event_name).toBe("test");
  });

  it("should update a sports event", async () => {
    // given
    const token = AuthService.generateToken("1");
    const storedEvent = await db
      .insertInto("sports_events")
      .values({
        event_name: "test",
        odds: "1.00",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // when
    const response = await supertest(global.app)
      .put(`/api/events/${storedEvent.event_id}`)
      .send({ event_name: "new_test", odds: "1.00" })
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(200);
    expect(response.body.event_name).toBe("new_test");
    expect(response.body.odds).toBe("1.00");

    const event = await db
      .selectFrom("sports_events")
      .selectAll()
      .where("event_id", "=", response.body.event_id)
      .executeTakeFirstOrThrow();
    expect(event.event_name).toBe("new_test");
  });

  it("should delete a sports event", async () => {
    // given
    const token = AuthService.generateToken("1");
    const storedEvent = await db
      .insertInto("sports_events")
      .values({
        event_name: "test",
        odds: "1.00",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // when
    const response = await supertest(global.app)
      .delete(`/api/events/${storedEvent.event_id}`)
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(200);
    const event = await db
      .selectFrom("sports_events")
      .selectAll()
      .where("event_id", "=", storedEvent.event_id)
      .executeTakeFirst();
    expect(event).toBeUndefined();
  });

  it("should get a sports event", async () => {
    // given
    const token = AuthService.generateToken("1");
    const event = await db
      .insertInto("sports_events")
      .values({
        event_name: "test",
        odds: "1.00",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    // when
    const response = await supertest(global.app)
      .get(`/api/events/${event.event_id}`)
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(200);
    expect(response.body.event_name).toBe("test");
  });

  it("should return 404 when event is not found", async () => {
    // given
    const token = AuthService.generateToken("1");

    // when
    const response = await supertest(global.app)
      .get("/api/sports-events/1")
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(404);
  });

  it("should return 401 when user is not authenticated", async () => {
    // when
    const response = await supertest(global.app).get("/api/events/1");

    // then
    expect(response.status).toBe(401);
  });
});
