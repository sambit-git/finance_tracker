import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from "sequelize";
import logger from "../config/logger.config.js"; // Import the logger instance

export const errorHandler = (err, req, res, next) => {
  logger.error(err);
  const statusCode = err.status || 500;
  const errorResponse = {
    error: err.message || "Internal Server Error",
  };

  // Log the stack trace only in development mode
  if (process.env.NODE_ENV === "development") {
    logger.error(err.stack);
  }

  // Handle different error types and provide tailored error messages
  if (err instanceof ValidationError) {
    // Validation error (field validation failure)
    const validationErrors = err.errors.map((e) => ({
      message: e.message,
      path: e.path,
      value: e.value,
    }));

    errorResponse.details = validationErrors;
    res.status(400).json(errorResponse);
  } else if (err instanceof UniqueConstraintError) {
    // Unique constraint violation error
    const uniqueError = err.errors.map((e) => ({
      message: e.message,
      path: e.path,
      value: e.value,
    }));

    errorResponse.details = uniqueError;
    res.status(400).json(errorResponse);
  } else if (err instanceof ForeignKeyConstraintError) {
    // Foreign key constraint violation error
    errorResponse.message = "Foreign key constraint error";
    errorResponse.details = err.message;
    res.status(400).json(errorResponse);
  } else if (err instanceof DatabaseError) {
    // Generic database error (e.g., connection issues)
    errorResponse.message = err.message || "Database error";
    res.status(500).json(errorResponse);
  } else {
    // For any other unknown errors
    errorResponse.message = err.message || "Unexpected error";
    res.status(statusCode).json({ errorResponse });
  }
};
