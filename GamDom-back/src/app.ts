import express from "express";
import type { Express } from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { getLogger, globalLogger } from "./logger";
import { db } from "./db/db";
import { errorHandler } from "./middleware/error-handler.middleware";
import sportsEventsRoutes from "./routes/sports-events.routes";
import authRoutes from "./routes/auth.route";
import { Logger } from "pino";
import { sql } from "kysely";

interface AppDomain {
  shutdown: () => Promise<void>;
  app: Express;
  logger: Logger;
}

const logger = getLogger("app");

async function pingDb() {
  await sql`SELECT 1`.execute(db).catch((error) => {
    logger.error("Error pinging db", { error });
    throw error;
  });
}

export async function run(): Promise<AppDomain> {
  logger.debug("Starting server...");

  const app = express();

  app.use(pinoHttp({ logger: globalLogger }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());

  app.use("/api/auth", authRoutes);
  app.use("/api/events", sportsEventsRoutes);

  app.use(errorHandler);

  await pingDb();

  return {
    app,
    shutdown: async () => {
      await db.destroy();
    },
    logger,
  };
}
