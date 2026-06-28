import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    redirect("/");
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: user.id,
    },
    include: {
      analysis: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalComparisons = await prisma.jobMatch.count({
    where: {
      resume: {
        userId: user.id,
      },
    },
  });

  const latestComparison =
    await prisma.jobMatch.findFirst({
      where: {
        resume: {
          userId: user.id,
        },
      },
      include: {
        resume: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const totalResumes = resumes.length;

  const averageScore =
    totalResumes === 0
      ? 0
      : Math.round(
          resumes.reduce(
            (sum, resume) =>
              sum + (resume.analysis?.score ?? 0),
            0
          ) / totalResumes
        );

  const highestScore =
    totalResumes === 0
      ? 0
      : Math.max(
          ...resumes.map(
            (resume) =>
              resume.analysis?.score ?? 0
          )
        );

  const latestResume = resumes[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          Welcome back 👋
        </h1>

        <p className="text-muted-foreground mt-2">
          Track your resume performance and
          improve your chances of getting hired.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          title="Total Resumes"
          value={totalResumes}
        />

        <StatCard
          title="Average ATS"
          value={averageScore}
        />

        <StatCard
          title="Highest ATS"
          value={highestScore}
        />

        <StatCard
          title="JD Comparisons"
          value={totalComparisons}
        />

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="rounded-2xl border p-6">

          <h2 className="text-xl font-semibold mb-4">
            Recent Resume
          </h2>

          {latestResume ? (
            <>
              <h3 className="font-semibold text-lg">
                {latestResume.title}
              </h3>

              <p className="text-muted-foreground">
                ATS Score:
                {" "}
                {latestResume.analysis?.score ??
                  "-"}
              </p>

              <Link
                href={`/dashboard/resumes/${latestResume.id}`}
                className="text-blue-600 mt-4 inline-block"
              >
                View Resume →
              </Link>
            </>
          ) : (
            <p>No resume uploaded yet.</p>
          )}

        </div>

        <div className="rounded-2xl border p-6">

          <h2 className="text-xl font-semibold mb-4">
            Recent Comparison
          </h2>

          {latestComparison ? (
            <>
              <h3 className="font-semibold text-lg">
                {latestComparison.resume.title}
              </h3>

              <p className="text-muted-foreground">
                Match Score:
                {" "}
                {latestComparison.matchScore}%
              </p>

              <Link
                href={`/dashboard/compare/${latestComparison.id}`}
                className="text-blue-600 mt-4 inline-block"
              >
                View Comparison →
              </Link>
            </>
          ) : (
            <p>No comparison yet.</p>
          )}

        </div>

      </div>

      <div className="rounded-2xl border p-6">

        <h2 className="text-xl font-semibold mb-5">
          Quick Actions
        </h2>

        <div className="flex gap-4">

          <Link
            href="/dashboard/resumes"
            className="rounded-xl bg-black text-white px-6 py-3"
          >
            Upload Resume
          </Link>

          <Link
            href="/dashboard/compare"
            className="rounded-xl border px-6 py-3"
          >
            Compare JD
          </Link>

        </div>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border p-6">
      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>
    </div>
  );
}