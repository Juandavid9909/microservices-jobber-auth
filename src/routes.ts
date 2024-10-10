import { Application } from "express";
import { authRoutes } from "@auth/routes/auth";
import { verifyGatewayRequest } from "@juandavid9909/jobber-shared";

const BASE_PATH = "/api/v1/auth";

export const appRoutes = (app: Application): void => {
  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
};
