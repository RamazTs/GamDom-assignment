import type { Kysely } from "kysely";
import type { Database } from "../src/db/db";

export async function seed(db: Kysely<Database>): Promise<void> {
  await db
    .insertInto("sports_events")
    .values([
      {
        event_name: "Match: Team A vs Team B - Outcome: Team A wins",
        odds: "1.50",
      },
      {
        event_name: "Match: Team C vs Team D - Outcome: Team B wins",
        odds: "2.00",
      },
      {
        event_name: "Match: Team E vs Team F - Outcome: Draw",
        odds: "1.80",
      },
      {
        event_name: "Match: Team G vs Team H - Outcome: Team C wins",
        odds: "2.50",
      },
      {
        event_name: "Match: Team I vs Team J - Outcome: Team D wins",
        odds: "1.90",
      },
    ])
    .execute();
}
