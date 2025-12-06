import pkg from "pg";
const { Pool } = pkg;
import { config } from "../config.js";

const pool = new Pool({ connectionString: config.DATABASE_URL });

export default async function (fastify, opts) {
  fastify.get("/quiz/:id", async (req, reply) => {
    const quizId = req.params.id;

    try {
      // Fetch quiz
      const quizRes = await pool.query("SELECT * FROM quizzes WHERE id = $1", [quizId]);
      if (quizRes.rowCount === 0) return reply.code(404).send({ error: "Quiz not found" });

      // Fetch questions including options
      const qRes = await pool.query(
        "SELECT question, options, answer FROM questions WHERE quiz_id = $1",
        [quizId]
      );

      return { quiz: quizRes.rows[0], questions: qRes.rows };
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Internal server error" });
    }
  });
}
