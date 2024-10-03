import { config } from "@auth/config";
import { Logger } from "winston";
import { Sequelize } from "sequelize";
import { winstonLogger } from "@juandavid9909/jobber-shared";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "authDatabaseServer", "debug");

export const sequelize = new Sequelize(config.MYSQL_DB!, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    multipleStatements: true
  }
});

export const databaseConnection = async (): Promise<void> => {
  try {
    await sequelize.authenticate();

    log.info("AuthService MySQL database connection has been established successfully.");
  } catch (error) {
    log.error("Auth service - Unable to connect to database.");
    log.log("error", "AuthService databaseConnection() method error:", error);
  }
};
