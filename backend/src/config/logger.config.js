import { createLogger, format, transports } from "winston";
import path from "path";
import util from "util";

const logDir = path.resolve("logs");

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack, ...rest }) => {
    const formattedMessage = util.format(
      message,
      ...(rest[Symbol.for("splat")] || [])
    );
    const finalMessage = stack
      ? formattedMessage + "\n" + stack
      : formattedMessage;
    return `${timestamp} [${level}]: ${finalMessage}`;
  })
);

const logFileTransport = new transports.File({
  filename: path.join(logDir, `${new Date().toISOString().slice(0, 10)}.log`),
});

const consoleTransport = new transports.Console({
  format: format.combine(format.colorize(), logFormat),
});

const logger = createLogger({
  format: logFormat,
  transports: [logFileTransport, consoleTransport],
});

export default logger;
