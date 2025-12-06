type Props = { q: { question: string; options: string[]; answer?: string } };

export default function QuizCard({ q }: Props) {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-md hover:shadow-lg transition">
      {/* Question */}
      <h3 className="font-semibold text-lg mb-4">{q.question}</h3>

      {/* Options as styled clickable items */}
      <div className="grid gap-3">
        {q.options.map((option, i) => (
          <div
            key={i}
            className="px-4 py-2 border rounded-md cursor-pointer hover:bg-blue-50 transition"
          >
            <span className="font-medium mr-2">{String.fromCharCode(65 + i)})</span>
            {option}
          </div>
        ))}
      </div>

      {/* Optional: show answer (for demo or review) */}
      {q.answer && (
        <p className="mt-3 text-green-700 font-medium">
          ✅ Answer: {q.answer}
        </p>
      )}
    </div>
  );
}
