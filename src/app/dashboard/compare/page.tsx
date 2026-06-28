import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CompareForm from "@/components/compare/compare-form";

export default async function ComparePage() {
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

  const jobMatches = await prisma.jobMatch.findMany({
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-10">
      {/* Hero Section */}
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 text-white">
        <div className="p-10">
          

          <h1 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">
            Compare Resume with
            <br />
            Job Description
          </h1>

          <p className="mt-5 max-w-3xl text-slate-300 leading-7">
            Select one of your uploaded resumes and compare it
            against a job description. Receive a detailed
            compatibility score, missing skills, strengths,
            weaknesses, and personalized improvement suggestions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-300">
                Uploaded Resumes
              </p>

              <p className="text-2xl font-bold">
                {resumes.length}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-300">
                AI Analysis
              </p>

              <p className="text-2xl font-bold">
                Instant
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
              <p className="text-xs text-slate-300">
                Match Report
              </p>

              <p className="text-2xl font-bold">
                ATS Ready
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <CompareForm
  resumes={resumes}
  jobMatches={jobMatches}
/>
    </div>
  );
}