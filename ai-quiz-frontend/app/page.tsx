// app/page.tsx
import FileUpload from "./components/FileUpload";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Quiz Generator</h1>
      {/* <p className="mb-4 text-gray-600">Upload a PDF / Word / PPTX and get a generated quiz.</p> */}
      <FileUpload />
    </main>
  );
}
