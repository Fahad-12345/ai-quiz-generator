import { generateQuizFromText } from "../services/aiService.js";
import { saveQuiz } from "../services/quizService.js";

export default async function (fastify, opts) {
  fastify.post("/generate", async (req, reply) => {
    try {
      const { title = "New Quiz", text } = req.body; // <- no || {}
      if (!text) return reply.code(400).send({ error: "Missing text" });

      const questions = await generateQuizFromText(text, title);
      const quizId = await saveQuiz(title, questions);

      return { quizId, questions };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: err.message });
    }
  });
}
