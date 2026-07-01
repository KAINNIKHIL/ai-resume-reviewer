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
  FilePenLine,
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
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
  <StatCard
    title="Total Resumes"
    value={totalResumes}
    subtitle="Uploaded resumes"
    trend="+2 this month"
    icon={<FileText className="h-5 w-5 text-blue-500" />}
    gradient="from-blue-500/10 to-blue-100/20 hover:border-blue-300"
  />

  <StatCard
    title="Average ATS"
    value={`${averageScore}%`}
    subtitle="Across all resumes"
    trend={averageScore >= 80 ? "Excellent" : "Needs improvement"}
    icon={<BarChart3 className="h-5 w-5 text-emerald-500" />}
    gradient="from-emerald-500/10 to-emerald-100/20 hover:border-emerald-300"
  />

  <StatCard
    title="Highest ATS"
    value={`${highestScore}%`}
    subtitle="Best performing resume"
    trend="Personal best"
    icon={<Award className="h-5 w-5 text-amber-500" />}
    gradient="from-amber-500/10 to-amber-100/20 hover:border-amber-300"
  />

  <StatCard
    title="JD Comparisons"
    value={totalComparisons}
    subtitle="AI job matches"
    trend={`${totalComparisons} completed`}
    icon={<GitCompare className="h-5 w-5 text-indigo-500" />}
    gradient="from-indigo-500/10 to-indigo-100/20 hover:border-indigo-300"
  />
</div>

      {/* Main Content Splitted Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Resume */}
        <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Resume</h2>
              <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FileText className="h-4 w-4" />
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
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
            </Link>
          )}
        </div>

        {/* Recent Comparison */}
        <div className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Recent Comparison</h2>
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                <GitCompare className="h-4 w-4" />
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
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
  <div>
    <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>

    <p className="mt-1 text-sm text-zinc-500">
      Start a new AI workflow in one click.
    </p>
  </div>

  <div className="grid gap-5 md:grid-cols-3">
    <Link
      href="/dashboard/resumes"
      className="group rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <Upload size={24} />
      </div>

      <h3 className="mt-6 text-lg font-bold">Upload Resume</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Upload a new resume and receive an AI-powered ATS analysis.
      </p>

      <div className="mt-6 flex items-center gap-2 font-medium text-blue-600">
        Get Started
        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </div>
    </Link>

    <Link
      href="/dashboard/compare"
      className="group rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <GitCompare size={30} />
      </div>

      <h3 className="mt-6 text-lg font-bold">Compare with JD</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Match your resume with any job description and discover missing skills.
      </p>

      <div className="mt-6 flex items-center gap-2 font-medium text-purple-600">
        Analyze Match
        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </div>
    </Link>

    <Link
      href="/dashboard/cover-letter"
      className="group rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
        <FilePenLine size={24} />
      </div>

      <h3 className="mt-6 text-lg font-bold">Generate Cover Letter</h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500">
        Create a tailored cover letter in seconds using AI.
      </p>

      <div className="mt-6 flex items-center gap-2 font-medium text-emerald-600">
        Generate
        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </div>
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
      <div className="flex items-center justify-between space-y-0">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          {title}
        </p>
        <div className="rounded-md bg-gray-50 p-1.5 border border-gray-100">
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