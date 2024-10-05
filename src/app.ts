import { databaseConnection } from "@auth/database";
import { start } from "@auth/server";
import express, { Express } from "express";

const initialize = (): void => {
  const app: Express = express();

  databaseConnection();
  start(app);
};

initialize();
