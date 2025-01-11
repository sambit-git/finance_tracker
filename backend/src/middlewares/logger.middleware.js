import logger from "../config/logger.config.js";

export const loggerMiddleware = (req, res, next) => {
  // Log request details, headers, and parameters
  const requestHeaders = JSON.stringify(req.headers, null, 2);
  const requestParams = JSON.stringify(req.params, null, 2);
  const requestQuery = JSON.stringify(req.query, null, 2);

  logger.info(`Request: ${req.method} ${req.url}`);
  logger.info(`Request Headers: ${requestHeaders}`);
  logger.info(`Request Params: ${requestParams}`);
  logger.info(`Request Query: ${requestQuery}`);

  // Log request body (ensure body-parser middleware or similar is used earlier)
  if (req.body) {
    const requestBody = JSON.stringify(req.body, null, 2);
    logger.info(`Request Body: ${requestBody}`);
  }

  // Log response headers
  res.on("header", () => {
    const responseHeaders = JSON.stringify(res.getHeaders(), null, 2);
    logger.info(`Response Headers: ${responseHeaders}`);
  });

  // Intercept the response body
  const oldSend = res.send;
  res.send = function (body) {
    // Log the response body (if available)
    if (body) {
      logger.info(`Response Body: ${body}`);
    }
    // Call the original res.send method to continue the response cycle
    oldSend.apply(res, arguments);
  };

  // Log when the response is finished
  res.on("finish", () => {
    const responseMessage = `Response: ${res.statusCode} for ${req.method} ${req.url}`;
    logger.info(responseMessage); // Log status code and request/response info
  });

  next();
};
