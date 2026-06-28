import { prisma } from "@/lib/prisma";

export default async function ResumeOptimizationPage({
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
      optimization: true,
    },
  });

  

  if (!resume) {
    return <div>Resume not found.</div>;
  }

  if (!resume.optimization) {
    return <div>No optimization found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Resume Optimization
        </h1>

        <p className="text-muted-foreground">
          AI optimized version of your resume.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Original Resume */}

        <div className="rounded-2xl border p-6">

          <h2 className="text-2xl font-semibold mb-4">
            Original Resume
          </h2>

          <pre className="whitespace-pre-wrap text-sm">
            {resume.extractedText}
          </pre>

        </div>

        <div className="rounded-2xl border bg-green-50 p-6">
  <h2 className="text-2xl font-bold mb-4">
    AI Improvements
  </h2>

  <ul className="space-y-3">
    {(
      resume.optimization.aiSummary as string[]
    ).map((item, index) => (
      <li
        key={index}
        className="flex gap-3"
      >
        <span>✅</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
</div>

        {/* Optimized Resume */}

        <div className="rounded-2xl border border-green-500 p-6 bg-green-50">

          <h2 className="text-2xl font-semibold mb-4 text-green-700">
            Optimized Resume
          </h2>

          <pre className="whitespace-pre-wrap text-sm">
            {
              resume.optimization
                .optimizedResume
            }
          </pre>

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="rounded-xl border p-5">

          <h3 className="font-semibold mb-3">
            Improved Summary
          </h3>

          <p>
            {
              resume.optimization
                .optimizedSummary
            }
          </p>

        </div>

        <div className="rounded-xl border p-5">

          <h3 className="font-semibold mb-3">
            Improved Skills
          </h3>

          <div className="flex flex-wrap gap-2">

            {Object.entries(
  resume.optimization
    .optimizedSkills as Record<string, string[]>
).map(([category, skills]) => (
  <div
    key={category}
    className="mb-5"
  >
    <h4 className="font-semibold mb-2">
      {category}
    </h4>

    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className="px-3 py-1 rounded-full bg-green-100"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
))}

          </div>

        </div>

      </div>

    </div>
  );
}