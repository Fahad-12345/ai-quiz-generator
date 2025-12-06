import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { extractText } from "../services/textService.js";
import { generateQuizFromText } from "../services/aiService.js";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export default async function (fastify, opts) {
  fastify.post("/upload", async (req, reply) => {
    try {
      const mp = await req.file();
      if (!mp) return reply.code(400).send({ error: "No file uploaded" });

      const id = nanoid();
      const ext = mp.filename.split(".").pop();
      const filename = `${id}.${ext}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = await mp.toBuffer();
      await fs.promises.writeFile(filePath, buffer);

      // Extract text from file
      const text = await extractText(filePath);
      if (!text || text.length === 0) {
        return reply.code(400).send({ error: "File has no extractable text" });
      }

      // Generate quiz
      const quiz = await generateQuizFromText(text);
      if (!quiz || quiz.length === 0) {
        return reply.code(500).send({ error: "Quiz generation failed" });
      }

      return {
        message: "Quiz generated successfully",
        filePath,
        text: text.slice(0, 5000),
        quiz
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.code(500).send({ error: err.message });
    }
  });
}
