import "dotenv/config";

const getPortConfig = () => ({
  port: process.env.PORT || 3000,
});

const getDbConfig = () => ({
  dbUrl: process.env.DB_URL || "mongodb://localhost:27017/gateway",
});

const getMicroserviceUrls = () => ({
  idp: process.env.IDP_URL || "http://localhost:3001",
  videoProvider: process.env.VIDEO_PROVIDER_URL || "http://localhost:3002",
});

export default () => ({
  portConfig: getPortConfig(),
  getDbConfig: getDbConfig(),
  microserviceUrls: getMicroserviceUrls(),
});
