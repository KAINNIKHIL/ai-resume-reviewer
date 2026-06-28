"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ResumeCard from "./resume-card";
import JobDescriptionCard from "./job-description-card";

interface JobMatch {
  id: string;
  matchScore: number;
  createdAt: Date;

  resume: {
    title: string;
  };
}

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
  jobMatches: JobMatch[];
}

export default function CompareForm({
  resumes,
  jobMatches,
}: Props) {
  const router = useRouter();

  const [jobDescription, setJobDescription] =
    useState("");

  const [loadingResumeId, setLoadingResumeId] =
    useState<string | null>(null);

  async function handleCompare(
    resumeId: string
  ) {
    if (!jobDescription.trim()) {
      alert("Paste a Job Description first.");
      return;
    }

    try {
      setLoadingResumeId(resumeId);

      const response = await fetch(
        "/api/resume/job-match",
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
          data.message || "Comparison failed"
        );
      }

      router.push(`/dashboard/compare/${data.id}`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoadingResumeId(null);
    }
  }

  return (
    <div>

      

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
                  Upload a resume before using AI
                  Job Match.
                </p>
              </div>
            ) : (
              resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  loading={
                    loadingResumeId ===
                    resume.id
                  }
                  onCompare={() =>
                    handleCompare(resume.id)
                  }
                />
              ))
            )}

          </div>

        </div>

      </div>

      {/* Compare History */}

<div className="mt-12">

  <div className="flex justify-between items-center mb-5">
    <h2 className="text-2xl font-bold">
      Recent Comparisons
    </h2>

    <span className="text-sm text-muted-foreground">
      {jobMatches.length} total
    </span>
  </div>

  {jobMatches.length === 0 ? (
    <div className="rounded-2xl border border-dashed p-10 text-center">
      <p className="font-semibold">
        No comparisons yet
      </p>

      <p className="text-sm text-muted-foreground mt-2">
        Compare a resume with a Job Description to
        see history here.
      </p>
    </div>
  ) : (
    <div className="grid md:grid-cols-2 gap-4">

      {jobMatches.map((match) => (
        <Link
          key={match.id}
          href={`/dashboard/compare/${match.id}`}
        >
          <div className="border rounded-2xl p-5 hover:shadow-md transition cursor-pointer">

            <h3 className="font-semibold text-lg">
              {match.resume.title}
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              {new Date(
                match.createdAt
              ).toLocaleString()}
            </p>

            <div className="mt-4 flex justify-between items-center">

              <span className="text-sm text-muted-foreground">
                Match Score
              </span>

              <span className="text-2xl font-bold">
                {match.matchScore}%
              </span>

            </div>

          </div>
        </Link>
      ))}

    </div>
  )}

</div>

    </div>
  );
}