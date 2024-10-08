import { Channel } from "amqplib";
import { config } from "@auth/config";
import { createConnection } from "@auth/queues/connection";
import { Logger } from "winston";
import { winstonLogger } from "@juandavid9909/jobber-shared";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "authServiceProducer", "debug");

export const publishDirectMessage = async (channel: Channel, exchangeName: string, routingKey: string, message: string, logMessage: string
): Promise<void> => {
  try {
    if(!channel) {
      channel = await createConnection() as Channel;
    }

    await channel.assertExchange(exchangeName, "direct");

    channel.publish(exchangeName, routingKey, Buffer.from(message));

    log.info(logMessage);
  } catch (error) {
    log.log("error", "AuthService Provider publishDirectMessage() method error:", error);
  }
};
