import { runPostgresContainer } from "./config/postgres-container";
import { StartedTestContainer } from "testcontainers";
import { Express } from "express";
import { db } from "../src/db/db";
import { FileMigrationProvider, Migrator } from "kysely";
import { promises as fs } from "fs";
import path from "path";

declare global {
  var app: Express;
  var postgres: StartedTestContainer;
  var shutdown: () => Promise<void>;
}

export default async function () {
  const postgresContainer = await runPostgresContainer();
  global.postgres = postgresContainer;

  const migrator = new Migrator({
    db: db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "../migrations"),
    }),
  });

  const { error } = await migrator.migrateToLatest();

  if (error) {
    throw error;
  }
}
