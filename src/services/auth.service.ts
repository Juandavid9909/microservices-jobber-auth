import { authChannel } from "@auth/server";
import { AuthModel } from "@auth/models/auth.schema";
import { IAuthBuyerMessageDetails, IAuthDocument } from "@juandavid9909/jobber-shared";
import { Model } from "sequelize";
import { publishDirectMessage } from "@auth/queues/auth.producer";
import { omit } from "lodash";

export const createAuthUser = async (data: IAuthDocument): Promise<IAuthDocument> => {
  const result: Model = await AuthModel.create(data);
  const messageDetails: IAuthBuyerMessageDetails = {
    username: result.dataValues.username!,
    email: result.dataValues.email!,
    profilePicture: result.dataValues.profilePicture!,
    country: result.dataValues.country!,
    createdAt: result.dataValues.createdAt!,
    type: "auth"
  };

  await publishDirectMessage(
    authChannel,
    "jobber-buyer-update",
    "user-buyer",
    JSON.stringify(messageDetails),
    "Buyer details sent to buyer service"
  );

  const userData: IAuthDocument = omit(result.dataValues, ["password"]) as IAuthDocument;

  return userData;
};
