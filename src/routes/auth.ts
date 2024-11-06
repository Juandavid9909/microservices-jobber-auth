import { create } from "@auth/controllers/signup";
import { read } from "@auth/controllers/signin";
import express, { Router } from "express";

const router: Router = express.Router();

export const authRoutes = (): Router => {
  router.post("/signup", create);
  router.post("/signin", read);

  return router;
};
