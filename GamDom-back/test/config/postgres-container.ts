import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { Wait } from "testcontainers";
import { appConfig } from "../../src/app-config";

export async function runPostgresContainer() {
  const postgresContainer = await new PostgreSqlContainer("postgres:16")
    .withExposedPorts(5432)
    .withUsername(appConfig.db.username)
    .withPassword(appConfig.db.password)
    .withDatabase(appConfig.db.database)
    .withWaitStrategy(
      Wait.forLogMessage(/database system is ready to accept connections/)
    )
    .start();

  return postgresContainer;
}
