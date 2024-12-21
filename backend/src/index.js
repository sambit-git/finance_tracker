import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; // Import path module
import { fileURLToPath } from "url"; // For ES module compatibility
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware for parsing JSON
app.use(express.json());
// Middleware for allowing CORS
app.use(cors());
// Logging middleware
app.use(loggerMiddleware);

// API routes
app.use("/api", routes);

// Serve static files from frontend/dist
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// Catch-all route to serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Error handling middleware (should be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
