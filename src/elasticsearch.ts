import { Client } from "@elastic/elasticsearch";
import { ClusterHealthResponse, GetResponse } from "@elastic/elasticsearch/lib/api/types";
import { config } from "@auth/config";
import { Logger } from "winston";
import { winstonLogger } from "@juandavid9909/jobber-shared";

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "authElasticSearchServer", "debug");

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
  auth: {
    username: `${config.ELASTIC_USERNAME}`,
    password: `${config.ELASTIC_PASSWORD}`
  }
});

const checkConnection = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    log.info("AuthService connection to ElasticSearch...");

    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});

      log.info(`AuthService Elasticsearch health status - ${health.status}`);

      isConnected = true;
    } catch (error) {
      log.error("Connection to Elasticsearch failed. Retrying...");
      log.log("error", "AuthService checkConnection() method error:", error);
    }
  }
};

const checkIfIndexExists = async (indexName: string): Promise<boolean> => {
  const result: boolean = await elasticSearchClient.indices.exists({ index: indexName });

  return result;
};

const createIndex = async (indexName: string): Promise<void> => {
  try {
    const result: boolean = await checkIfIndexExists(indexName);

    if (result) {
      log.info(`Index "${indexName}" already exists.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });

      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error ocurred while creating the index ${indexName}`);
    log.log("error", "AuthService createIndex() method error:", error);
  }
};

const getDocumentById = async (index: string, gigId: string) => {
  try {
    const result: GetResponse = await elasticSearchClient.get({
      index,
      id: gigId
    });

    return result._source;
  } catch (error) {
    log.log("error", "AuthService elasticsearch getDocumentById() method error:", error);

    return {};
  }
};

export { elasticSearchClient, checkConnection, createIndex, getDocumentById };
