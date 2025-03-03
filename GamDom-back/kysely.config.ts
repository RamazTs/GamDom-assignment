import { defineConfig } from "kysely-ctl";
import { dialect } from "./src/db/db";

export default defineConfig({
  dialect: dialect,
  migrations: {
    migrationFolder: "migrations",
  },
  seeds: {
    seedFolder: "seeds",
  },
});
