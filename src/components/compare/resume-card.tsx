"use client";

import { FileText, Loader2 } from "lucide-react";

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
}

export default function ResumeCard({
  resume,
  loading,
  onCompare,
}: Props) {
  const score = resume.analysis?.score ?? 0;

  const scoreColor =
    score >= 80
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : score >= 60
      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  return (
    <div
      className="
        rounded-2xl
        border
        bg-card
        p-5
        transition-all
        hover:shadow-lg
        hover:border-primary
      "
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

        {/* Resume Info */}
        <div className="flex items-start gap-4 flex-1 min-w-0">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <FileText className="h-7 w-7 text-primary" />
          </div>

          <div className="min-w-0 flex-1">

            <h3 className="truncate text-lg font-semibold">
              {resume.title}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Uploaded{" "}
              {new Date(resume.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${scoreColor}`}
              >
                ATS {score}
              </span>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Resume
              </span>

            </div>

          </div>
        </div>

        {/* Compare Button */}
        <button
          onClick={onCompare}
          disabled={loading}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-indigo-600
            to-violet-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:opacity-90
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:w-auto
          "
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Comparing...
            </>
          ) : (
            "Compare"
          )}
        </button>

      </div>
    </div>
  );
}