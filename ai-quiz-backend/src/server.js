import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { config } from "./config.js";
import fastifyCors from "@fastify/cors";
import uploadRoutes from "./routes/upload.js";
import generateRoutes from "./routes/generate.js";
import quizRoutes from "./routes/quiz.js";
import db from "./db.js";

const app = Fastify({ logger: true });

await app.register(fastifyCors, {
  origin: ["http://localhost:3000"], // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
});

// Register multipart globally for file uploads only
app.register(multipart, {
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
  // DO NOT use attachFieldsToBody
});

// Register routes
app.register(uploadRoutes, { prefix: "/api" });    // /upload uses multipart
app.register(generateRoutes, { prefix: "/api" });  // /generate uses JSON
app.register(quizRoutes, { prefix: "/api" });      // /quiz/:id

// Simple DB test route
app.get("/quiz-db", async (req, reply) => {
  try {
    await db.query("SELECT NOW()");
    reply.send({ connected: true });
  } catch (err) {
    reply.code(500).send({ connected: false, error: err.message });
  }
});

// Start server
const start = async () => {
  try {
    await app.listen({ port: config.PORT, host: "0.0.0.0" });
    console.log(`Server running on port ${config.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
