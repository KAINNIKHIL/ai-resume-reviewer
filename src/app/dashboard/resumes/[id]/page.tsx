import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OptimizeButton from "@/components/resume/optimize-button";

export default async function ResumeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const resume = await prisma.resume.findUnique({
    where: {
      id,
    },
    include: {
      analysis: true,
    },
  });

  if (!resume) {
    return <div>Resume not found</div>;
  }

  return (
  <div className="max-w-5xl mx-auto space-y-8">
    <div>
      <h1 className="text-3xl font-bold">
        {resume.title}
      </h1>

      <p className="text-muted-foreground">
        Resume Analysis Report
      </p>
    </div>

    <div className="border rounded-2xl p-6">
      <h2 className="text-4xl font-bold">
        {resume.analysis?.score}/100
      </h2>

      <p className="text-lg text-muted-foreground mt-2">
        {resume.analysis?.remark || "No remark"}
      </p>
    </div>

    <div className="flex gap-4">
  <Link
    href={`/dashboard/compare`}
    className="px-6 py-3 rounded-xl border"
  >
    Compare with JD
  </Link>

  <OptimizeButton
    resumeId={resume.id}
  />
</div>

    <div className="grid md:grid-cols-2 gap-6">

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4 text-green-600">
          Strengths
        </h3>

        <ul className="space-y-2">
          {(resume.analysis?.strengths as string[])?.map(
            (item, index) => (
              <li key={index}>
                ✅ {item}
              </li>
            )
          )}
        </ul>
      </div>

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4 text-red-600">
          Weaknesses
        </h3>

        <ul className="space-y-2">
          {(resume.analysis?.weaknesses as string[])?.map(
            (item, index) => (
              <li key={index}>
                ⚠️ {item}
              </li>
            )
          )}
        </ul>
      </div>

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4 text-yellow-600">
          Missing Skills
        </h3>

        <div className="flex flex-wrap gap-2">
          {(resume.analysis?.missingSkills as string[])?.map(
            (item, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-yellow-100"
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>

      <div className="border rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">
          Suggestions
        </h3>

        <ul className="space-y-2">
          {(resume.analysis?.suggestions as string[])?.map(
            (item, index) => (
              <li key={index}>
                💡 {item}
              </li>
            )
          )}
        </ul>
      </div>

    </div>
  </div>
);
}