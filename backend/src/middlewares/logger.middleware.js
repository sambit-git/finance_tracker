import logger from "../config/logger.config.js";

export const loggerMiddleware = (req, res, next) => {
  const message = `Request: ${req.method} ${req.url}`;
  logger.info(message); // Log request details

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
