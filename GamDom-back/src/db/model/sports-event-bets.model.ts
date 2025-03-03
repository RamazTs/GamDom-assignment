import { ColumnType, Generated, Insertable, Selectable } from "kysely";

export interface SportsEventBetsTable {
  bet_id: Generated<number>;
  event_id: number;
  user_id: number;
  bet_amount: string;
  odds: string;
  created_at: ColumnType<Date, string | undefined, never>;
}

export type SportsEventBet = Selectable<SportsEventBetsTable>;
export type InsertableSportsEventBet = Insertable<SportsEventBetsTable>;
