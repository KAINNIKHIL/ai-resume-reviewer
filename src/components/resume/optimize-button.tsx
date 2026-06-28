"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  resumeId: string;
}

export default function OptimizeButton({
  resumeId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleOptimize() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/resume/optimize",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            resumeId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Optimization failed"
        );
      }

      router.push(
        `/dashboard/resumes/${resumeId}/optimization`
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleOptimize}
      disabled={loading}
      className="px-6 py-3 rounded-xl bg-black text-white disabled:opacity-50"
    >
      {loading
        ? "Optimizing..."
        : "Optimize Resume"}
    </button>
  );
}