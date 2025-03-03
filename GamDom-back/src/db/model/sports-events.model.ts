import {
  Generated,
  Insertable,
  Selectable,
  ColumnType,
  Updateable,
} from "kysely";

export interface SportsEventsTable {
  event_id: Generated<number>;
  event_name: string;
  odds: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, Date>;
}

export type SportsEvent = Selectable<SportsEventsTable>;
export type InsertableSportsEvent = Insertable<SportsEventsTable>;
export type UpdateableSportsEvent = Updateable<SportsEventsTable>;
