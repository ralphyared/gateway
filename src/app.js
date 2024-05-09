import express from "express";
import mongoose from "mongoose";
import _ from "lodash";
import bodyParser from "body-parser";

import config from "./global/config.js";
import { routes } from "./router.js";
import { insertAuditTrail, sendAxiosRequest } from "./global/utils.js";
import { authError } from "./global/error.js";

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(config().getDbConfig.dbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// Add MongoDB middleware
app.use((req, res, next) => {
  req.db = mongoose.connection;
  next();
});

// Global Routing Function
const globalRoutingFunction = async (req, res, next) => {
  const method = req.method.toLowerCase();
  const currentRouteObj = _.find(
    routes,
    (route) => route.api === req.route.path && route.methods.includes(method)
  );

  if (currentRouteObj) {
    let url = `${currentRouteObj.microserviceUrl}`;

    if (req.params) {
      Object.keys(req.params).forEach((key) => {
        url = url.replace(`:${key}`, req.params[key]);
      });
    }

    try {
      const response = await sendAxiosRequest(
        url,
        method,
        req.headers.authorization,
        req.body,
        req.query
      );
      await insertAuditTrail(
        req,
        response.data,
        response.status,
        currentRouteObj.microserviceName
      );
      res.status(response.status).send(response.data);
    } catch (err) {
      await insertAuditTrail(
        req,
        err.messages,
        err.statusCode,
        currentRouteObj.microserviceName
      );
      next(err);
    }
  }
};

// Authentication Middleware
export const authenticateFunctionMiddleware = async (req, res, next) => {
  const idpUrl = config().microserviceUrls.idp;
  try {
    const response = await sendAxiosRequest(
      `${idpUrl}/user/profile`,
      "get",
      req.headers.authorization
    );
    req.user = response.data;
    next();
  } catch (err) {
    next(authError.notAuthenticated);
  }
};

// Dynamic route handling
routes.forEach((route) => {
  if (route.isAuthenticated) {
    app.use(route.api, authenticateFunctionMiddleware);
  }

  const router = app.route(route.api);

  route.methods.forEach((method) => {
    switch (method) {
      case "get":
        router.get(globalRoutingFunction);
        break;
      case "post":
        router.post(globalRoutingFunction);
        break;
      case "delete":
        router.delete(globalRoutingFunction);
        break;
      case "put":
        router.put(globalRoutingFunction);
        break;
    }
  });
});

//Error Handling Middleware
app.use((error, req, res, next) => {
  const status = error.statusCode || error.status || 500;
  const messages = error.messages ? error.messages : [error.messages];
  res.status(status).send({ messages });
});

//Start Server
const port = config().portConfig.port;
app.listen(port, () => {
  console.log(`Gateway microservice is running on port ${port}`);
});
