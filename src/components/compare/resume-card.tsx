"use client";

import {
  FileText,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Resume {
  id: string;
  title: string;
  createdAt: Date;
  analysis: {
    score: number;
  } | null;
}

interface Props {
  resume: Resume;
  loading: boolean;
  onCompare: () => void;
  buttonText?: string;
}

export default function ResumeCard({
  resume,
  loading,
  onCompare,
  buttonText = "Compare JD",
}: Props) {
  const score = resume.analysis?.score ?? 0;

  const scoreColor =
    score >= 80
      ? "#10B981"
      : score >= 60
      ? "#F59E0B"
      : "#EF4444";

  const status =
    score >= 80
      ? "Excellent ATS"
      : score >= 60
      ? "Needs Improvement"
      : "Low ATS";

  const circumference = 2 * Math.PI * 15.9155;
  const offset =
    circumference - (score / 100) * circumference;

  return (
    <div
      className="
      group
      rounded-3xl
      border
      border-zinc-200
      bg-white
      p-6
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      hover:border-blue-200
    "
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT */}
        <div className="flex gap-5 flex-1">
          {/* Resume Icon */}
          <div
            className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-blue-500
            to-indigo-600
            text-white
            shadow-lg
            transition-transform
            duration-300
            group-hover:scale-105
          "
          >
            <FileText size={24} />
          </div>

          {/* Resume Details */}
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-xl font-bold text-zinc-900">
              {resume.title}
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Uploaded{" "}
              {new Date(
                resume.createdAt
              ).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                PDF Resume
              </span>

              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                <Sparkles
                  size={12}
                  className="inline mr-1"
                />
                AI Reviewed
              </span>
            </div>

            {/* Progress */}
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-zinc-500">
                <span>ATS Performance</span>

                <span>{score}%</span>
              </div>

              <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${score}%`,
                    background: scoreColor,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center gap-5">
          {/* Circular Score */}
          <div className="relative h-24 w-24">
            <svg
              className="-rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="3"
              />

              <path
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0-31.831"
                fill="none"
                stroke={scoreColor}
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">
                {score}
              </span>

              <span className="text-[10px] uppercase tracking-wider text-zinc-500">
                ATS
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="font-semibold text-zinc-900">
              {status}
            </p>

            <p className="text-xs text-zinc-500 mt-1">
              AI Resume Analysis
            </p>
          </div>

          <button
            onClick={onCompare}
            disabled={loading}
            className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-zinc-900
            px-5
            py-3
            text-sm
            font-medium
            text-white
            transition-all
            hover:bg-black
            hover:shadow-lg
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          >
            {loading ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={16}
                />
                Processing...
              </>
            ) : (
              <>
                {buttonText}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}