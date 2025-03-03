import { run } from "../src/app";
import { db } from "../src/db/db";
import { sql } from "kysely";

beforeAll(async () => {
  const { app, shutdown } = await run();
  global.app = app;
  global.shutdown = shutdown;
});

beforeEach(async () => {
  await sql`TRUNCATE TABLE users, sports_events, sports_event_bets`.execute(db);
});
