"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ResumeCard from "@/components/compare/resume-card";
import JobDescriptionCard from "@/components/compare/job-description-card";

interface Resume {
  id: string;
  title: string;
  createdAt: Date;
  analysis: {
    score: number;
  } | null;
}

interface Props {
  resumes: Resume[];
}

export default function CoverLetterForm({
  resumes,
}: Props) {
  const router = useRouter();

  const [jobDescription, setJobDescription] =
    useState("");

  const [loadingResumeId, setLoadingResumeId] =
    useState<string | null>(null);

  async function handleGenerate(
    resumeId: string
  ) {
    if (!jobDescription.trim()) {
      alert("Please paste the Job Description.");
      return;
    }

    try {
      setLoadingResumeId(resumeId);

      const response = await fetch(
        "/api/resume/cover-letter",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            resumeId,
            jobDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to generate cover letter."
        );
      }

      router.push(
        `/dashboard/cover-letter/${data.id}`
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoadingResumeId(null);
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">

      {/* Left */}

      <div className="lg:col-span-3">

        <JobDescriptionCard
          value={jobDescription}
          onChange={setJobDescription}
        />

      </div>

      {/* Right */}

      <div className="lg:col-span-2">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold">
            Your Resumes
          </h2>

          <span className="text-sm text-muted-foreground">
            {resumes.length} total
          </span>

        </div>

        <div className="space-y-4">

          {resumes.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">

              <p className="font-semibold">
                No resumes uploaded
              </p>

              <p className="text-sm text-muted-foreground mt-2">
                Upload a resume first.
              </p>

            </div>
          ) : (
            resumes.map((resume) => (
              <ResumeCard
  key={resume.id}
  resume={resume}
  loading={loadingResumeId === resume.id}
  onCompare={() => handleGenerate(resume.id)}
  buttonText="Generate Cover Letter"
/>
            ))
          )}

        </div>

      </div>

    </div>
  );
}