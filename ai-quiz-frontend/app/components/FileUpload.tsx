"use client";

import { useState } from "react";
import API from "@/libs/api";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");

  // Separate loading states
  const [loadingFile, setLoadingFile] = useState(false);
  const [loadingText, setLoadingText] = useState(false);

  const router = useRouter();

  // --------------------------
  // FILE UPLOAD HANDLER
  // --------------------------
  const handleFileUpload = async () => {
    if (!file) return alert("Please select a file.");

    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoadingFile(true);
      const res = await API.post("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data;
      console.log(data,'dataaa11111')

      if (data.quiz && Array.isArray(data.quiz)) {
        sessionStorage.removeItem("latestQuestions");
        sessionStorage.setItem("latestQuestions", JSON.stringify(data.quiz));
      }

      router.push("/quiz");

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || err.message || "Upload failed");
      } else {
        alert("Upload failed");
      }
    } finally {
      setLoadingFile(false);
    }
  };

  // --------------------------
  // TEXT-TO-QUIZ HANDLER
  // --------------------------
  const handleTextGenerate = async () => {
    if (!text.trim()) return alert("Please enter some text.");

    try {
      setLoadingText(true);

      const res = await API.post("/api/generate", { text });
      console.log(res,'ressss2222222')
      const { questions } = res.data;

      if (questions) {
        sessionStorage.removeItem("latestQuestions");
        sessionStorage.setItem("latestQuestions", JSON.stringify(questions));
      }

      router.push("/quiz");

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || err.message || "Generation failed");
      } else {
        alert("Generation failed");
      }
    } finally {
      setLoadingText(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* FILE UPLOAD SECTION */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Upload a File</h2>

        <div className="flex items-center gap-4">
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.docx,.pptx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition"
          >
            Choose File
          </label>
          <span className="text-gray-700">{file ? file.name : "No file chosen"}</span>
        </div>

        <p className="text-sm text-gray-500">
          Supported formats: PDF, Word (.docx), PowerPoint (.pptx)
        </p>

        <button
          type="button"
          onClick={handleFileUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
          disabled={loadingFile}
        >
          {loadingFile ? <><Spinner /> Uploading...</> : "Upload & Generate Quiz"}
        </button>
      </div>

      {/* TEXT INPUT SECTION */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Or Paste Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          className="block w-full p-2 border rounded-md"
          rows={6}
        />
        <button
          type="button"
          onClick={handleTextGenerate}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
          disabled={loadingText}
        >
          {loadingText ? <><Spinner /> Generating...</> : "Generate Quiz"}
        </button>
      </div>

    </div>
  );
}
