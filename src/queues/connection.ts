import { config } from "@auth/config";
import { Logger } from "winston";
import { winstonLogger } from "@juandavid9909/jobber-shared";
import client, { Channel, Connection } from "amqplib";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "authQueueConnection", "debug");

export const createConnection = async (): Promise<Channel | undefined> => {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();

    log.info("Auth server connected to queue succesfully...");

    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    log.log("error", "AuthService error createConnection() method error:", error);

    return undefined;
  }
};

const closeConnection = (channel: Channel, connection: Connection): void => {
  process.once("SIGINT", async () => {
    await channel.close();
    await connection.close();
  });
};
