import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import models from "../models/index.js";
import dotenv from "dotenv";
import logger from "../config/logger.config.js";

dotenv.config();

const { Auth } = models;

// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hour, you can adjust as needed
  );
};

// Register User
export const register = async (req, res) => {
  try {
    const { fullName, username, password, photo } = req.body;
    logger.info("body: ", {
      fullName,
      username,
      password: !!password,
      photo,
    });

    // Check if user already exists
    const existingUser = await Auth.findOne({ where: { username } });
    if (existingUser) {
      logger.info("existing user");
      return res.status(400).json({ error: "Username already taken" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await Auth.create({
      fullName,
      username,
      password: hashedPassword,
      photo,
    });

    // Generate JWT token
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        fullName: newUser.fullName,
        photo: newUser.photo,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.info("body: ", { username, password: !!password });

    // Find user by username
    const user = await Auth.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        photo: user.photo,
      },
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Get current user (This would be protected by authenticateToken middleware)
export const getCurrentUser = (req, res) => {
  // req.user will be available due to the authenticateToken middleware
  res.status(200).json({
    user: {
      id: req.user.id,
      username: req.user.username,
      fullName: req.user.fullName,
      photo: req.user.photo,
    },
  });
};
