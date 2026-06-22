"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      alert("Please select a PDF");
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();

formData.append("resume", file);

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
});

      const data = await response.json();

      alert(
  `${data.message}\nResume ID: ${data.resume.id}`
);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
      },
      maxFiles: 1,
      onDrop,
    });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer"
      >
        <input {...getInputProps()} />

        {isDragActive ? (
          <p>Drop your resume here...</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold">
              Upload Your Resume
            </h2>

            <p className="text-muted-foreground mt-2">
              Drag & drop a PDF here, or click to select.
            </p>
          </>
        )}

        {file && (
          <div className="mt-6">
            <p className="font-medium">{file.name}</p>

            <p className="text-sm text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={!file || isLoading}
        className="border rounded-md px-4 py-2 disabled:opacity-50"
      >
        {isLoading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
}