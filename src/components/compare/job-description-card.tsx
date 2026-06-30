"use client";

import {
  BriefcaseBusiness,
  Sparkles,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function JobDescriptionCard({
  value,
  onChange,
}: Props) {
  const characterCount = value.length;

  return (
    <div
      className="
        rounded-3xl
        border
        border-zinc-200
        bg-white
        shadow-sm
        p-8
        h-full
        flex
        flex-col
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between">

        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Sparkles size={14} />
            AI Job Match
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900">
            Paste Job Description
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
            Paste the complete job description from any hiring platform.
            Our AI will compare it against your selected resume and
            identify missing keywords, ATS compatibility, and improvement
            opportunities.
          </p>

        </div>

        <div className="hidden md:flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg">
          <BriefcaseBusiness size={26} />
        </div>

      </div>

      {/* Supported Platforms */}

      <div className="mt-6 flex flex-wrap gap-2">

        {[
          "LinkedIn",
          "Indeed",
          "Naukri",
          "Wellfound",
          "Greenhouse",
          "Lever",
        ].map((item) => (
          <span
            key={item}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
          >
            {item}
          </span>
        ))}

      </div>

      {/* Textarea */}

      <div className="mt-8 flex-1">

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the complete Job Description here..."
          className="
            h-[500px]
            w-full
            resize-none
            rounded-3xl
            border
            border-zinc-200
            bg-zinc-50
            p-6
            text-sm
            leading-7
            text-zinc-800
            outline-none
            transition-all
            duration-200
            placeholder:text-zinc-400
            focus:border-blue-500
            focus:bg-white
            focus:ring-4
            focus:ring-blue-100
          "
        />

      </div>

      {/* Footer */}

      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Tips */}

        <div className="space-y-2">

          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <CheckCircle2
              size={16}
              className="text-emerald-500"
            />
            Include responsibilities
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <CheckCircle2
              size={16}
              className="text-emerald-500"
            />
            Include required skills
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-700">
            <CheckCircle2
              size={16}
              className="text-emerald-500"
            />
            Include qualifications
          </div>

        </div>

        {/* Character Counter */}

        <div className="rounded-2xl border bg-zinc-50 px-5 py-4">

          <div className="flex items-center gap-2">

            <ClipboardList
              size={18}
              className="text-zinc-500"
            />

            <div>

              <p className="text-xs text-zinc-500">
                Characters
              </p>

              <p className="text-lg font-bold text-zinc-900">
                {characterCount.toLocaleString()}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}