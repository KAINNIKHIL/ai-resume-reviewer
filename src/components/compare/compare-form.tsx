"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

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

  const [selectedResume, setSelectedResume] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function handleCompare() {
    if (!selectedResume) {
      alert("Select a resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Paste a Job Description first.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/resume/job-match",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            resumeId: selectedResume,
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
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">

      {/* Hero */}

      <div className="rounded-3xl border bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">

        <div className="flex items-center gap-3">

          <div className="rounded-2xl bg-blue-600 p-3 text-white">
            <Sparkles size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              AI Job Match
            </h1>

            <p className="text-zinc-600 mt-2">
              Compare your resume with any Job
              Description and discover missing
              keywords, ATS compatibility and AI
              suggestions.
            </p>
          </div>

        </div>

      </div>

      {/* Main Grid */}

      <div className="grid lg:grid-cols-5 gap-8">

        {/* LEFT */}

        <div className="lg:col-span-3">

          <JobDescriptionCard
            value={jobDescription}
            onChange={setJobDescription}
          />

        </div>

        {/* RIGHT */}

        <div className="lg:col-span-2">

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-2xl font-bold">
                Select Resume
              </h2>

              <p className="text-sm text-zinc-500">
                Choose one resume
              </p>

            </div>

            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm">
              {resumes.length}
            </span>

          </div>

          <div className="space-y-4">

            {resumes.map((resume) => (

              <div
                key={resume.id}
                onClick={() =>
                  setSelectedResume(resume.id)
                }
                className={`cursor-pointer rounded-3xl transition
                ${
                  selectedResume === resume.id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >

                <ResumeCard
                  resume={resume}
                  loading={false}
                  buttonText="Selected"
                  onCompare={() => {}}
                />

              </div>

            ))}

          </div>

          {/* Button */}

          <button
            disabled={
              !selectedResume || loading
            }
            onClick={handleCompare}
            className="
            mt-6
            w-full
            rounded-2xl
            bg-blue-600
            py-4
            text-white
            font-semibold
            transition
            hover:bg-blue-700
            disabled:opacity-50
            flex
            justify-center
            items-center
            gap-2
          "
          >
            {loading ? (
              "Analyzing..."
            ) : (
              <>
                Analyze Match
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </div>

      </div>

      {/* History */}

      <div>

        <div className="flex justify-between mb-6">

          <h2 className="text-2xl font-bold">
            Recent Comparisons
          </h2>

          <span className="text-zinc-500">
            {jobMatches.length}
          </span>

        </div>

        {jobMatches.length === 0 ? (

          <div className="rounded-3xl border border-dashed p-12 text-center">

            <CheckCircle2
              className="mx-auto text-zinc-400"
              size={40}
            />

            <h3 className="mt-4 text-lg font-semibold">
              No comparisons yet
            </h3>

            <p className="text-zinc-500 mt-2">
              Analyze your first resume to see
              history here.
            </p>

          </div>

        ) : (

          <div className="grid gap-4">

            {jobMatches.map((match) => (

              <Link
                key={match.id}
                href={`/dashboard/compare/${match.id}`}
              >

                <div className="rounded-3xl border p-6 hover:shadow-lg transition">

                  <div className="flex justify-between items-center">

                    <div>

                      <h3 className="font-semibold text-lg">
                        {match.resume.title}
                      </h3>

                      <p className="text-sm text-zinc-500 mt-1">
                        {new Date(
                          match.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div className="text-right">

                      <div className="text-3xl font-bold text-blue-600">
                        {match.matchScore}%
                      </div>

                      <p className="text-xs text-zinc-500">
                        ATS Match
                      </p>

                    </div>

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