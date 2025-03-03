import supertest from "supertest";
import { db } from "../../src/db/db";
import AuthService from "../../src/services/auth.service";
describe("when creating bet", () => {
  it("should create a bet", async () => {
    // given
    const token = AuthService.generateToken("1");
    const event = await db
      .insertInto("sports_events")
      .values({ event_name: "test", odds: "1.00" })
      .returningAll()
      .executeTakeFirstOrThrow();

    // when
    const response = await supertest(global.app)
      .post(`/api/events/${event.event_id}/bets`)
      .send({ bet_amount: "100.00" })
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(201);
    expect(response.body.event_id).toBe(event.event_id);
    expect(response.body.bet_amount).toBe("100.00");
    expect(response.body.odds).toBe(event.odds);
    expect(response.body.created_at).toBeDefined();

    const bet = await db
      .selectFrom("sports_event_bets")
      .selectAll()
      .where("bet_id", "=", response.body.bet_id)
      .executeTakeFirstOrThrow();
    expect(bet.bet_amount).toBe("100.00");
    expect(bet.odds).toBe(event.odds);
  });

  it("should return 404 when event is not found", async () => {
    // given
    const token = AuthService.generateToken("1");

    // when
    const response = await supertest(global.app)
      .post("/api/events/1/bets")
      .send({ bet_amount: "100.00" })
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(404);
  });

  it("should return 401 when user is not authenticated", async () => {
    // when
    const response = await supertest(global.app)
      .post("/api/events/1/bets")
      .send({ bet_amount: "100.00" });

    // then
    expect(response.status).toBe(401);
  });
});
