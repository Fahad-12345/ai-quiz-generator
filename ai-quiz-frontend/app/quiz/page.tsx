"use client";

import { useState, useEffect } from "react";
import QuizList from "../components/QuizList";
import Link from "next/link";
import { jsPDF } from "jspdf";

// Define the shape of a quiz question
interface QuizQuestion {
  question: string;
  answer: string;
  options: string[];
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize state from sessionStorage safely
  useEffect(() => {
    // guard for server / build
    if (typeof window === "undefined") return;

    const saved = window.sessionStorage.getItem("latestQuestions");
    if (saved) setQuestions(JSON.parse(saved));

    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Function to download quiz as PDF
  const downloadQuizPDF = () => {
    if (questions.length === 0) return;

    const doc = new jsPDF();
    let y = 10;

    doc.setFontSize(16);
    doc.text("Generated Quiz", 105, y, { align: "center" });
    y += 10;
    doc.setFontSize(12);

    questions.forEach((q, index) => {
      const questionText = `${index + 1}. ${q.question}`;
      const splitQuestion = doc.splitTextToSize(questionText, 180);
      doc.text(splitQuestion, 10, y);
      y += splitQuestion.length * 7;

      q.options.forEach((opt, i) => {
        const optionText = String.fromCharCode(65 + i) + ") " + opt;
        const splitOption = doc.splitTextToSize(optionText, 180);
        doc.text(splitOption, 15, y);
        y += splitOption.length * 7;
      });

      y += 5;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("quiz.pdf");
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Generated Quiz</h1>

        <div className="flex gap-2">
          {/* Back Button */}
          <Link
            href="/"
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
          >
            ← Back to Home
          </Link>

          {/* Download PDF Button */}
          <button
            onClick={downloadQuizPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            disabled={questions.length === 0}
          >
            💾 Download PDF
          </button>
        </div>
      </div>

      {questions.length > 0 ? (
        <QuizList quizzes={questions} />
      ) : (
        <p className="text-gray-500">
          No quiz found. Please upload or enter text again.
        </p>
      )}
    </main>
  );
}
