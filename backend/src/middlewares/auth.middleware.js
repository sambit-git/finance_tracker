import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "../config/logger.config.js";

dotenv.config();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "Access token is required" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to the request
    logger.info(`user added to request`);
    next();
  } catch (err) {
    logger.error(`Token is invalid or expired!`);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

// export const authorizeRole = (requiredRole) => (req, res, next) => {
//   if (req.user && req.user.role === requiredRole) {
//     next();
//   } else {
//     res.status(403).json({ error: "Access denied: insufficient permissions" });
//   }
// };
