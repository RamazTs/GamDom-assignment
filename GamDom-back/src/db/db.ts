import { Kysely } from "kysely";
import { Pool } from "pg";
import { PostgresDialect } from "kysely";
import { appConfig } from "../app-config";
import { UsersTable } from "./model/user.model";
import { SportsEventsTable } from "./model/sports-events.model";
import { SportsEventBetsTable } from "./model/sports-event-bets.model";

export interface Database {
  users: UsersTable;
  sports_events: SportsEventsTable;
  sports_event_bets: SportsEventBetsTable;
}

const pool = new Pool({
  host: appConfig.db.host,
  port: appConfig.db.port,
  user: appConfig.db.username,
  password: appConfig.db.password,
  database: appConfig.db.database,
  max: 10,
});

export const dialect = new PostgresDialect({ pool });

export const db = new Kysely<Database>({
  dialect,
});
