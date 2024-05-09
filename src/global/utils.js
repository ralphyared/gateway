import axios from "axios";
import AuditTrail from "../models/audit-trail.model.js";

export const sendAxiosRequest = async (
  url,
  method,
  authorization,
  body,
  query
) => {
  const axiosConfig = {
    method: method,
    url: url,
  };

  if (authorization) {
    axiosConfig.headers = {
      Authorization: authorization,
    };
  }

  if (body) {
    axiosConfig.data = body;
  }
  if (query) {
    axiosConfig.params = query;
  }
  try {
    const response = await axios(axiosConfig);
    return response;
  } catch (err) {
    throw {
      messages: err.response.data.messages || err.response.data.message,
      statusCode: err.response.status,
    };
  }
};

export const insertAuditTrail = async (req, data, statusCode, microservice) => {
  const auditTrail = new AuditTrail({
    timestamp: new Date(),
    microservice: microservice,
    url: req.url,
    method: req.method,
    statusCode: statusCode,
    userId: (req.user && req.user.id) || "public",
    userAgent: req.headers["user-agent"],
    success: statusCode >= 200 && statusCode < 300,
    headers: req.headers,
    result: data,
    params: req.params,
    body: req.body,
  });

  return auditTrail.save();
};
