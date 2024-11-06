import crypto from "crypto";

import { authChannel } from "@auth/server";
import { BadRequestError, IAuthDocument, IEmailMessageDetails, lowerCase } from "@juandavid9909/jobber-shared";
import { config } from "@auth/config";
import { getAuthUserById, getUserByEmail, updateVerifyEmailField } from "@auth/services/auth.service";
import { publishDirectMessage } from "@auth/queues/auth.producer";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const read = async (req: Request, res: Response): Promise<void> => {
  let user = null;

  const existingUser: IAuthDocument = await getAuthUserById(req.currentUser!.id);

  if (Object.keys(existingUser).length) {
    user = existingUser;
  }

  res.status(StatusCodes.OK).json({
    message: "Authenticated user",
    user
  });
};

export const resendEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, userId } = req.body;
  const checkIfUserExists: IAuthDocument = await getUserByEmail(email);

  if (!checkIfUserExists) {
    throw new BadRequestError("Email is invalid", "CurrentUser resentEmail() method error");
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString("hex");
  const verificationLink = `${config.CLIENT_URL}/confirm-email? v_token=${randomCharacters}`;

  await updateVerifyEmailField(parseInt(userId), 0, randomCharacters);

  const messageDetails: IEmailMessageDetails = {
    receiverEmail: lowerCase(email),
    verifyLink: verificationLink,
    template: "verify-email"
  };

  await publishDirectMessage(
    authChannel,
    "jobber-email-notification",
    "auth-email",
    JSON.stringify(messageDetails),
    "Verify email message has been sent to notification service."
  );

  const updatedUser = await getAuthUserById(parseInt(userId));

  res.status(StatusCodes.CREATED).json({
    message: "Email verification sent",
    user: updatedUser
  });
};
