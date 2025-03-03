import {
  ColumnType,
  Generated,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface UsersTable {
  id: Generated<number>;
  email: string;
  password: string;
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, Date>;
}

export type User = Selectable<UsersTable>;
export type InsertableUser = Insertable<UsersTable>;
export type UpdateableUser = Updateable<UsersTable>;
