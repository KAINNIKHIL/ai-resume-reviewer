"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";



interface CompareFormProps {
  resumeId: string;
}

export default function CompareForm({
  resumeId,
}: CompareFormProps) {
  const [jobDescription, setJobDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);
    const router = useRouter();

  const handleCompare = async () => {
  if (!jobDescription.trim()) {
    alert("Please paste a job description.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "/api/resume/job-match",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId,
          jobDescription,
        }),
      }
    );

    const data = await response.json();

    console.log("Job Match:", data);

    if (!response.ok) {
      throw new Error(
        data.message || "Comparison failed"
      );
    }

    router.push(
      `/dashboard/resumes/${resumeId}/compare/${data.id}`
    );
  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="rounded-xl border p-6 space-y-4">
      <h2 className="text-xl font-semibold">
        Paste Job Description
      </h2>

      <textarea
        value={jobDescription}
        onChange={(e) =>
          setJobDescription(e.target.value)
        }
        placeholder="Paste the complete job description here..."
        className="w-full h-72 rounded-lg border p-4 resize-none"
      />

      <button
        onClick={handleCompare}
        disabled={loading}
        className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {loading
          ? "Analyzing..."
          : "Analyze Match"}
      </button>

      
    </div>
  );
}