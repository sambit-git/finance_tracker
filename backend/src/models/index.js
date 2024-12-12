import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sequelize from "../config/database.config.js"; // Import Sequelize instance from config
import dotenv from "dotenv";
import logger from "../config/logger.config.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const models = {};

// Dynamically load all models
const loadModels = async () => {
  const files = fs
    .readdirSync(__dirname)
    .filter((file) => file.endsWith(".model.js"));

  for (const file of files) {
    const modelPath = path.join(__dirname, file);
    const module = await import(modelPath); // Use import() for ES modules
    const model = module.default(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  }

  // Associate models if applicable
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });

  models.sequelize = sequelize;
  models.Sequelize = Sequelize;

  try {
    await sequelize.sync({ force: false, alter: true });
    logger.info("Database synchronized successfully!");
  } catch (error) {
    logger.error("Error syncing database:", error);
  }

  return models;
};

export default await loadModels();
