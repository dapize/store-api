import { beforeAll } from "vitest";
import { AppDataSource } from "@config/database";

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    await AppDataSource.query("PRAGMA journal_mode = WAL;");
  }
});
