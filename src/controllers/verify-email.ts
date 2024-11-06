import { BadRequestError, IAuthDocument } from "@juandavid9909/jobber-shared";
import { getAuthUserById, getAuthUserByVerificationToken, updateVerifyEmailField } from "@auth/services/auth.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const update = async(req: Request, res: Response): Promise<void> => {
  const { token } = req.body;
  const checkIfUserExists: IAuthDocument = await getAuthUserByVerificationToken(token);

  if(!checkIfUserExists) {
    throw new BadRequestError("Verification token is either invalid or is already used", "VerifyEmail update() method error");
  }

  await updateVerifyEmailField(checkIfUserExists.id!, 1, "");

  const updatedUser: IAuthDocument = await getAuthUserById(checkIfUserExists.id!);

  res.status(StatusCodes.OK).json({
    message: "Email verified successfully",
    user: updatedUser
  });
};
