import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  FileText, 
  BarChart3, 
  Award, 
  GitCompare, 
  ArrowRight, 
  Upload, 
  PlusCircle 
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/");
  }

  const resumes = await prisma.resume.findMany({
    where: { userId: user.id },
    include: { analysis: true },
    orderBy: { createdAt: "desc" },
  });

  const totalComparisons = await prisma.jobMatch.count({
    where: {
      resume: { userId: user.id },
    },
  });

  const latestComparison = await prisma.jobMatch.findFirst({
    where: {
      resume: { userId: user.id },
    },
    include: { resume: true },
    orderBy: { createdAt: "desc" },
  });

  const totalResumes = resumes.length;

  const averageScore =
    totalResumes === 0
      ? 0
      : Math.round(
          resumes.reduce((sum, resume) => sum + (resume.analysis?.score ?? 0), 0) / totalResumes
        );

  const highestScore =
    totalResumes === 0
      ? 0
      : Math.max(...resumes.map((resume) => resume.analysis?.score ?? 0));

  const latestResume = resumes[0];

  return (
    <div className="max-w-7xl mx-auto space-y-10 px-4 py-8 md:px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome back, {session.user.name || "User"}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Track your resume performance and improve your chances of getting hired.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Resumes"
          value={totalResumes}
          icon={<FileText className="h-5 w-5 text-blue-500" />}
          gradient="hover:border-blue-500/30"
        />
        <StatCard
          title="Average ATS"
          value={`${averageScore}%`}
          icon={<BarChart3 className="h-5 w-5 text-emerald-500" />}
          gradient="hover:border-emerald-500/30"
        />
        <StatCard
          title="Highest ATS"
          value={`${highestScore}%`}
          icon={<Award className="h-5 w-5 text-amber-500" />}
          gradient="hover:border-amber-500/30"
        />
        <StatCard
          title="JD Comparisons"
          value={totalComparisons}
          icon={<GitCompare className="h-5 w-5 text-indigo-500" />}
          gradient="hover:border-indigo-500/30"
        />
      </div>

      {/* Main Content Splitted Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Resume */}
        <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Resume</h2>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-100 transition-colors">
                <FileText className="h-5 w-5" />
              </span>
            </div>

            {latestResume ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {latestResume.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">ATS Score:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    (latestResume.analysis?.score ?? 0) >= 70 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {latestResume.analysis?.score ?? "-"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground py-4 text-sm">No resumes uploaded yet.</p>
            )}
          </div>

          {latestResume && (
            <Link
              href={`/dashboard/resumes/${latestResume.id}`}
              className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group/link"
            >
              View Resume 
              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Recent Comparison */}
        <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Comparison</h2>
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-100 transition-colors">
                <GitCompare className="h-5 w-5" />
              </span>
            </div>

            {latestComparison ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                  {latestComparison.resume.title}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Match Score:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {latestComparison.matchScore}%
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground py-4 text-sm">No job matches completed yet.</p>
            )}
          </div>

          {latestComparison && (
            <Link
              href={`/dashboard/compare/${latestComparison.id}`}
              className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors group/link"
            >
              View Comparison 
              <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border bg-gray-50/50 p-6 md:p-8 shadow-inner">
        <h2 className="text-xl font-bold mb-6 text-foreground">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/resumes"
            className="flex items-center gap-2 rounded-xl bg-gray-900 text-white font-medium px-6 py-3.5 hover:bg-gray-800 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Upload className="h-4 w-4" />
            Upload Resume
          </Link>

          <Link
            href="/dashboard/compare"
            className="flex items-center gap-2 rounded-xl border bg-white font-medium px-6 py-3.5 hover:bg-gray-50 text-gray-700 shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="h-4 w-4 text-gray-500" />
            Compare JD
          </Link>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient?: string;
}

function StatCard({ title, value, icon, gradient = "" }: StatCardProps) {
  return (
    <div className={`rounded-2xl border bg-card p-6 shadow-sm transition-all ${gradient}`}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          {title}
        </p>
        <div className="rounded-lg bg-gray-50 p-2 border border-gray-100">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {value}
        </h2>
      </div>
    </div>
  );
}