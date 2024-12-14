import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

// Middleware for parsing JSON
app.use(express.json());
// Middleware for allowing CORS
app.use(cors());
// Logging middleware
app.use(loggerMiddleware);

// API routes
app.use("/api", routes);

// Error handling middleware (should be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
