import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
    matchId: string;
  }>;
}

export default async function CompareResultPage({
  params,
}: Props) {
  const { matchId } = await params;

  const match = await prisma.jobMatch.findUnique({
    where: {
      id: matchId,
    },
    include: {
      resume: true,
    },
  });

  if (!match) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8">
        <p className="text-sm opacity-80">
          JOB MATCH SCORE
        </p>

        <h1 className="text-5xl font-bold mt-2">
          {match.matchScore}%
        </h1>

        <p className="mt-3 opacity-80">
          Resume: {match.resume.title}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Matched Skills */}
        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold text-green-600 mb-4">
            ✅ Matched Skills
          </h2>

          <div className="flex flex-wrap gap-2">
            {(match.matchedSkills as string[]).map(
              (skill, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="rounded-2xl border p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            ❌ Missing Keywords
          </h2>

          <div className="flex flex-wrap gap-2">
            {(match.missingKeywords as string[]).map(
              (skill, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              )
            )}
          </div>
        </div>

      </div>

      {/* Suggestions */}
      <div className="rounded-2xl border p-6">
        <h2 className="text-xl font-semibold mb-5">
          💡 Suggestions
        </h2>

        <div className="space-y-3">
          {(match.suggestions as string[]).map(
            (item, index) => (
              <div
                key={index}
                className="rounded-xl border p-4"
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>

    </div>
  );
}