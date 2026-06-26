import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResumeUpload from "@/components/upload/resume-upload";
import Link from "next/link";

export default async function ResumesPage() {
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

  const avgScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce(
            (acc, resume) =>
              acc + (resume.analysis?.score || 0),
            0
          ) / resumes.length
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      {/* Hero */}
      <section className="rounded-3xl border bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8">
        <h1 className="text-4xl font-bold">
          AI Resume Reviewer
        </h1>

        <p className="mt-3 text-slate-300">
          Upload resumes, analyze ATS score and
          track improvements over time.
        </p>
      </section>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="rounded-2xl border p-6 bg-white shadow-sm">
          <p className="text-sm text-muted-foreground">
            Total Resumes
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {resumes.length}
          </h2>
        </div>

        <div className="rounded-2xl border p-6 bg-white shadow-sm">
          <p className="text-sm text-muted-foreground">
            Average ATS Score
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {avgScore}
          </h2>
        </div>

        <div className="rounded-2xl border p-6 bg-white shadow-sm">
          <p className="text-sm text-muted-foreground">
            Latest Upload
          </p>

          <h2 className="text-lg font-semibold mt-2">
            {resumes[0]
              ? new Date(
                  resumes[0].createdAt
                ).toLocaleDateString()
              : "-"}
          </h2>
        </div>
      </div>

      {/* Upload */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
          Upload Resume
        </h2>

        <ResumeUpload />
      </section>

      {/* Resume History */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Resume History
          </h2>

          <span className="text-sm text-muted-foreground">
            {resumes.length} uploaded
          </span>
        </div>

        {resumes.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <h3 className="font-semibold text-lg">
              No resumes yet
            </h3>

            <p className="text-muted-foreground mt-2">
              Upload your first resume to start
              analyzing.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
  {resumes.map((resume) => (
    <Link
      key={resume.id}
      href={`/dashboard/resumes/${resume.id}`}
      className="block"
    >
      <div className="border rounded-xl p-4 hover:shadow-md transition">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">
              {resume.title}
            </h3>

            <p className="text-sm text-muted-foreground">
              {resume.createdAt.toLocaleString()}
            </p>
          </div>

          {resume.analysis && (
            <div className="text-right">
              <p className="text-2xl font-bold">
                {resume.analysis.score}/100
              </p>

              <p className="text-sm text-muted-foreground">
                {resume.analysis.remark}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  ))}
</div>
        )}
      </section>
    </div>
  );
}