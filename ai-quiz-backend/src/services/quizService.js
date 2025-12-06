import pkg from "pg";
const { Pool } = pkg;
import { config } from "../config.js";

const pool = new Pool({ connectionString: config.DATABASE_URL });

export async function saveQuiz(title, questions) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Insert quiz and get its id
    const res = await client.query(
      "INSERT INTO quizzes (title) VALUES ($1) RETURNING id",
      [title]
    );
    const quizId = res.rows[0].id;

    // Insert each question
    const insertQ = `
      INSERT INTO questions (quiz_id, question, options, answer)
      VALUES ($1, $2, $3, $4)
    `;

    for (const q of questions) {
  // Ensure options is always an array of strings
  const optionsArray = Array.isArray(q.options) ? q.options : [];
  await client.query(insertQ, [quizId, q.question,optionsArray,q.answer]);
}

    await client.query("COMMIT");
    return quizId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
