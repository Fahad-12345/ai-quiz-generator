// app/components/QuizList.tsx
"use client";

export interface QuizItem {
  question: string;
  options: string[];
  answer: string;
}

interface QuizListProps {
  quizzes: QuizItem[];
}

export default function QuizList({ quizzes }: QuizListProps) {
  return (
    <div className="space-y-6">
      {quizzes.map((q, idx) => (
        <div
          key={idx}
          className="p-4 border rounded shadow-sm bg-white hover:shadow-md transition"
        >
          <p className="font-semibold mb-2">
            {idx + 1}. {q.question}
          </p>
          <div className="grid gap-2">
            {q.options.map((opt, i) => (
              <div
                key={i}
                className="px-3 py-2 border rounded hover:bg-gray-100 cursor-pointer"
              >
                {String.fromCharCode(65 + i)}) {opt}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
