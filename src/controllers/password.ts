import crypto from "crypto";

import { authChannel } from "@auth/server";
import { BadRequestError, IAuthDocument, IEmailMessageDetails } from "@juandavid9909/jobber-shared";
import { config } from "@auth/config";
import { emailSchema } from "@auth/schemes/password";
import { getUserByEmail, updatePasswordToken } from "@auth/services/auth.service";
import { publishDirectMessage } from "@auth/queues/auth.producer";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const createForgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { error } = await Promise.resolve(emailSchema.validate(req.body));

  if (error?.details) {
    throw new BadRequestError(error.details[0].message, "Password create() method error");
  }

  const { email } = req.body;
  const existingUser: IAuthDocument = await getUserByEmail(email);

  if (!existingUser) {
    throw new BadRequestError("Invalid credentials", "Password create() method error");
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString("hex");
  const date: Date = new Date();

  date.setHours(date.getHours() + 1);

  await updatePasswordToken(existingUser.id!, randomCharacters, date);

  const resetLink: string = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: existingUser.email,
    resetLink,
    username: existingUser.username,
    template: "forgotPassword"
  };

  await publishDirectMessage(
    authChannel,
    "jobber-email-notification",
    "auth-email",
    JSON.stringify(messageDetails),
    "Forgot password message sent to notification service"
  );

  res.status(StatusCodes.OK).json({
    message: "Password reset email sent."
  });
};
