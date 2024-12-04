import { Application } from "express";
import { authRoutes } from "@auth/routes/auth";
import { currentUserRoutes } from "@auth/routes/current-user";
import { healthRoutes } from "@auth/routes/health";
import { searchRoutes } from "@auth/routes/search";
import { verifyGatewayRequest } from "@juandavid9909/jobber-shared";

const BASE_PATH = "/api/v1/auth";

export const appRoutes = (app: Application): void => {
  app.use("", healthRoutes());
  app.use(BASE_PATH, searchRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
};
