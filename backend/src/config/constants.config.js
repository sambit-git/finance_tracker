export const ACCOUNT_TYPES = {
  BANK: "bank",
  WALLET: "wallet",
  CASH: "cash",
};

export const DEFAULT_ACCOUNT_BALANCE = 0.0;

export const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret"; // For authentication
export const TOKEN_EXPIRATION = "1h"; // Token expiration time
