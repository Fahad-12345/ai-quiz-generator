import { config } from "../config.js";

/**
 * Call Ollama API with a prompt and return combined text output.
 * Handles streamed event responses from Ollama.
 */
async function callOllama(prompt, model = config.OLLAMA_MODEL) {
  const url = `${config.OLLAMA_HOST}/api/generate`;

  const body = {
    model,
    prompt,
    options: { max_tokens: 800, temperature: 0.2 }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama error: ${res.status} ${text}`);
  }

  const text = await res.text();

  // Parse as array of JSON objects (one per line)
  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l); // remove empty lines

  let combined = "";

  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (obj?.response) {
        combined += obj.response;
      }
    } catch (err) {
      // skip lines that are not valid JSON
    }
  }

  // Remove code block markers ``` if any
  combined = combined.replace(/```/g, "").trim();

  return combined;
}

/**
 * Generate quiz JSON from text using Ollama.
 * Expects Ollama to return a JSON array.
 * Robust against malformed AI output and repeated uploads.
 */
export async function generateQuizFromText(text, title = "Generated Quiz") {
  const prompt = `
You are an expert in creating quizzes from educational text.

Input: The following text extracted from a document:
--------------------
${text.slice(0, 4000)}
--------------------

Task:
1) Generate up to 8 unique multiple-choice questions (no duplicates).
2) Each question must have:
   - "question": The question text
   - "answer": The correct answer (1-2 sentences)
   - "options": An array of 4 choices, including the correct answer
3) Ensure that the correct answer is one of the four options.
4) Shuffle the options randomly.
5) Skip questions if the text does not provide enough info.
6) Output MUST be valid JSON ONLY, like this:
[
  {
    "question": "What is JavaScript?",
    "answer": "A programming language",
    "options": ["A programming language", "A markup language", "A styling language", "A database"]
  },
  ...
]

Return only the JSON array — no extra explanation.
`;

  const raw = await callOllama(prompt);

  // Extract JSON array from raw text
  const firstBracket = raw.indexOf("[");
  const lastBracket = raw.lastIndexOf("]");
  if (firstBracket < 0 || lastBracket <= firstBracket) {
    throw new Error("Ollama output did not contain JSON array. Output:\n" + raw);
  }

  let jsonText = raw.slice(firstBracket, lastBracket + 1);

  // Sanitize common AI output issues
  jsonText = jsonText
    .replace(/([\{\[,]\s*\"?\w+\"?\s*:\s*)'([^']*)'/g, '$1"$2"') // single quotes to double quotes
    .replace(/```/g, "") // remove code blocks
    .replace(/(\w)\]/g, "$1)") // fix D] -> D)
    .replace(/(\w+)\s*:/g, '"$1":'); // quote property names

  let parsed = [];

  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    // fallback parser: extract individual objects
    const matches = jsonText.match(/\{[^}]+\}/g) || [];
    parsed = matches
      .map((m) => {
        try {
          return JSON.parse(m);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  // Remove duplicate questions (case-insensitive)
  const seen = new Set();
  parsed = parsed.filter((q) => {
    const key = q.question && q.question.toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Ensure correct answer is in options and shuffle
  parsed = parsed.map((q) => {
    let opts = Array.isArray(q.options) ? q.options : [];
    if (!opts.includes(q.answer)) {
      opts.push(q.answer);
    }
    opts = opts.sort(() => Math.random() - 0.5).slice(0, 4);
    return { question: q.question, answer: q.answer, options: opts };
  });

  return parsed;
}



