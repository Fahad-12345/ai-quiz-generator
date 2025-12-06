import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3001,
  DATABASE_URL: process.env.DATABASE_URL,
  OLLAMA_HOST: process.env.OLLAMA_HOST || "http://localhost:11434",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || "gemma2:2b"
};
