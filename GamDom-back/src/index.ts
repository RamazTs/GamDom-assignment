import { once } from "events";
import { run } from "./app";
import appConfig from "./app-config";

run().then(async ({ app, shutdown, logger }) => {
  const server = app.listen(appConfig.port).on("error", (error) => {
    logger.fatal(error);
  });

  await once(server, "listening").then(() => {
    logger.info(`Server is running on port ${appConfig.port}`);
  });

  const exitSignals = ["SIGTERM", "SIGINT"];

  exitSignals.forEach((signal) => {
    process.on(signal, async () => {
      logger.info(
        `Caught interrupt signal: ${signal}, gracefully shutting down...`
      );
      try {
        await shutdown();
      } catch (error) {
        logger.fatal(`Error during graceful shutdown: ${error}`);
        process.exit(1);
      }

      logger.info("All resources close, exiting...");
      process.exit(0);
    });
  });
});
