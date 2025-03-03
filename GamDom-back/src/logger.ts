import { pino } from "pino";
import { appConfig } from "./app-config";

function create() {
  const level = appConfig.logLevel;

  return pino({
    level,
    transport: {
      target: "pino-pretty",
      options: { colorize: true, singleLine: true },
    },
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths:
        appConfig.nodeEnv === "production" ? ["req.headers.authorization"] : [],
      remove: true,
    },
  });
}

export const globalLogger = create();

export const getLogger = (context: string) => globalLogger.child({ context });
