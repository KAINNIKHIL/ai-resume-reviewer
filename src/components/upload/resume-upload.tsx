"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  suggestions: string[];
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [analysis, setAnalysis] =
    useState<ResumeAnalysis | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];

    if (!uploadedFile) return;

    if (uploadedFile.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    if (uploadedFile.size > 5 * 1024 * 1024) {
      alert("File must be under 5MB");
      return;
    }

    setFile(uploadedFile);
    setAnalysis(null);
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.message || "Upload failed"
        );
      }

      const analyzeResponse = await fetch(
        "/api/resume/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeId: uploadData.resume.id,
          }),
        }
      );

      const analysisData = await analyzeResponse.json();

      console.log("Analysis:", analysisData);

      if (!analyzeResponse.ok) {
        throw new Error(
          analysisData.message || "Analysis failed"
        );
      }

      setAnalysis(analysisData.analysis);
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop,
  });

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />

        <UploadCloud
          size={60}
          className="mx-auto mb-4 text-blue-500"
        />

        <h2 className="text-2xl font-semibold">
          Upload Resume
        </h2>

        <p className="text-gray-500 mt-2">
          Drag & drop your PDF resume here
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Maximum size: 5MB
        </p>

        {file && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <FileText className="text-red-500" />

            <div>
              <p className="font-medium">
                {file.name}
              </p>

              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)}
                MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={!file || isLoading}
        className="w-full bg-black text-white rounded-xl py-3 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Analyze Resume
          </>
        )}
      </button>

      {/* Results */}
  {analysis && (
  <div className="max-w-5xl mx-auto mt-10 space-y-8">

    {/* SCORE HEADER */}
    <div className="rounded-3xl p-6 bg-gradient-to-r from-gray-900 to-gray-700 text-white flex items-center justify-between">
      <div>
        <p className="text-sm opacity-70">ATS SCORE</p>
        <h1 className="text-5xl font-bold">
          {analysis.score}/100
        </h1>

        <p className="mt-2 text-sm opacity-80">
          {analysis.score >= 80
            ? "Strong Resume 🚀"
            : analysis.score >= 60
            ? "Good but improve ⚡"
            : "Needs Work 🧱"}
        </p>
      </div>

      <div className="text-6xl">
        {analysis.score >= 80
          ? "🔥"
          : analysis.score >= 60
          ? "⚡"
          : "🚧"}
      </div>
    </div>

    {/* GRID */}
    <div className="grid md:grid-cols-2 gap-6">

      {/* STRENGTHS */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-green-600">
          💪 Strengths
        </h2>

        <div className="space-y-3">
  {analysis.suggestions.map((item, i) => (
    <div
      key={i}
      className="border rounded-xl p-4 bg-blue-50 hover:shadow-md transition"
    >
      <div className="font-semibold text-blue-700">
        💪 Strength+
      </div>
      <div className="text-sm text-blue-800 mt-1">
        {item}
      </div>
    </div>
  ))}
</div>
      </div>

      {/* WEAKNESSES */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-red-600">
          ⚠ Weaknesses
        </h2>

        <div className="space-y-3">
  {analysis.weaknesses.map((item, i) => (
    <div
      key={i}
      className="border rounded-xl p-4 bg-red-50 hover:shadow-md transition"
    >
      <div className="font-semibold text-red-700">
        ⚠ Issue {i + 1}
      </div>
      <div className="text-sm text-red-800 mt-1">
        {item}
      </div>
    </div>
  ))}
</div>
      </div>

      {/* MISSING SKILLS */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-yellow-600">
          🧠 Missing Skills
        </h2>

        <div className="flex flex-wrap gap-2">
          {analysis.missingSkills.map((item, i) => (
            <span
              key={i}
              className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* SUGGESTIONS */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-blue-600">
          💡 Suggestions
        </h2>

        <div className="space-y-3">
  {analysis.suggestions.map((item, i) => (
    <div
      key={i}
      className="border rounded-xl p-4 bg-blue-50 hover:shadow-md transition"
    >
      <div className="font-semibold text-blue-700">
        💡 Action Step
      </div>
      <div className="text-sm text-blue-800 mt-1">
        {item}
      </div>
    </div>
  ))}
</div>
      </div>

    </div>
  </div>
)}
    </div>
  );
}