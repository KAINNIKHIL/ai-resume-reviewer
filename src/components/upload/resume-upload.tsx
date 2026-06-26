"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

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
  }, []);

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please upload a resume");
      return;
    }

    try {
      setIsLoading(true);

      // Upload Resume
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

      // Analyze Resume
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

      const analysisData =
        await analyzeResponse.json();

      if (!analyzeResponse.ok) {
        throw new Error(
          analysisData.message || "Analysis failed"
        );
      }

      // Redirect to detail page
      router.push(
        `/dashboard/resumes/${uploadData.resume.id}`
      );
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
    </div>
  );
}