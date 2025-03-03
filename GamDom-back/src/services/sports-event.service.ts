import { db } from "../db/db";
import {
  InsertableSportsEventBet,
  SportsEventBet,
} from "../db/model/sports-event-bets.model";
import {
  InsertableSportsEvent,
  SportsEvent,
  UpdateableSportsEvent,
} from "../db/model/sports-events.model";
import { NotFoundError } from "../errors/http-errors";

interface CreateBetParams {
  user_id: number;
  sports_event_id: number;
  bet_amount: string;
}

interface CreateSportsEventParams {
  event_name: string;
  odds: string;
}

interface UpdateSportsEventParams {
  event_id: number;
  event_name: string;
  odds: string;
}

async function findAllEvents(): Promise<SportsEvent[]> {
  return db.selectFrom("sports_events").selectAll().execute();
}

async function findEventById(
  sports_event_id: number
): Promise<SportsEvent | undefined> {
  return db
    .selectFrom("sports_events")
    .where("event_id", "=", sports_event_id)
    .selectAll()
    .executeTakeFirst();
}

async function createEvent({
  event_name,
  odds,
}: CreateSportsEventParams): Promise<SportsEvent> {
  return db
    .insertInto("sports_events")
    .values({ event_name, odds } satisfies InsertableSportsEvent)
    .returningAll()
    .executeTakeFirstOrThrow();
}

async function updateEvent({
  event_id,
  event_name,
  odds,
}: UpdateSportsEventParams): Promise<SportsEvent> {
  return db
    .updateTable("sports_events")
    .set({
      event_name,
      odds,
      updated_at: new Date(),
    } satisfies UpdateableSportsEvent)
    .where("event_id", "=", event_id)
    .returningAll()
    .executeTakeFirstOrThrow();
}

async function deleteEvent(event_id: number): Promise<SportsEvent> {
  return db.transaction().execute(async (tx) => {
    await tx
      .deleteFrom("sports_event_bets")
      .where("event_id", "=", event_id)
      .execute();

    return tx
      .deleteFrom("sports_events")
      .where("event_id", "=", event_id)
      .returningAll()
      .executeTakeFirstOrThrow();
  });
}

async function createBet({
  user_id,
  sports_event_id,
  bet_amount,
}: CreateBetParams): Promise<SportsEventBet> {
  return db.transaction().execute(async (tx) => {
    const event = await tx
      .selectFrom("sports_events")
      .where("event_id", "=", sports_event_id)
      .selectAll()
      .executeTakeFirst();

    if (!event) {
      throw new NotFoundError("Sports event not found");
    }

    const bet = await tx
      .insertInto("sports_event_bets")
      .values({
        event_id: sports_event_id,
        bet_amount: bet_amount,
        odds: event.odds,
        user_id: user_id,
      } satisfies InsertableSportsEventBet)
      .returningAll()
      .executeTakeFirstOrThrow();

    return bet;
  });
}

async function findBetsByUserId(
  user_id: number
): Promise<(SportsEventBet & { event_name: string | null })[]> {
  const response = await db
    .selectFrom("sports_event_bets")
    .where("user_id", "=", user_id)
    .leftJoin(
      "sports_events",
      "sports_event_bets.event_id",
      "sports_events.event_id"
    )
    .select([
      "sports_event_bets.user_id",
      "sports_event_bets.event_id",
      "sports_event_bets.bet_id",
      "sports_event_bets.bet_amount",
      "sports_event_bets.odds",
      "sports_event_bets.created_at",
      "sports_events.event_name",
    ])
    .execute();

  return response as (SportsEventBet & { event_name: string | null })[];
}

export default {
  findAllEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  createBet,
  findBetsByUserId,
};
