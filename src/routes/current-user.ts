import { read, resendEmail } from "@auth/controllers/current-user";
import express, { Router } from "express";

const router: Router = express.Router();

export const currentUserRoutes = (): Router => {
  router.get("/currentUser", read);
  router.post("/resend-email", resendEmail);

  return router;
};
