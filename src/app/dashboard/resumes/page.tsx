import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResumeUpload from "@/components/upload/resume-upload";
import Link from "next/link";
import { 
  FileText, 
  BarChart3, 
  Calendar, 
  Trash2, 
  ArrowUpRight, 
  History 
} from "lucide-react";

export default async function ResumesPage() {
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

  const avgScore =
    resumes.length > 0
      ? Math.round(
          resumes.reduce((acc, resume) => acc + (resume.analysis?.score || 0), 0) / resumes.length
        )
      : 0;

  return (
   
    <div className="max-w-7xl mx-auto space-y-14 px-4 py-10 md:px-6">
      
 
      <section className="rounded-3xl border bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            AI Resume Reviewer
          </h1>
          <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed">
            Upload resumes, analyze ATS scores, and track your optimization progress over time.
          </p>
        </div>
      </section>

    
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          title="Total Resumes"
          value={resumes.length}
          icon={<FileText className="h-4 w-4 text-blue-500" />}
        />
        <StatCard
          title="Average ATS Score"
          value={`${avgScore}%`}
          icon={<BarChart3 className="h-4 w-4 text-emerald-500" />}
        />
        <StatCard
          title="Latest Upload"
          value={
            resumes[0]
              ? new Date(resumes[0].createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "-"
          }
          icon={<Calendar className="h-4 w-4 text-indigo-500" />}
        />
      </div>

   
      <section className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <FileText className="h-4 w-4 text-gray-400" />
          <h2 className="text-xl font-bold text-foreground">Upload Resume</h2>
        </div>
        <div className="mt-4">
          <ResumeUpload />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-gray-500" />
            <h2 className="text-xl font-bold text-foreground">Resume History</h2>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider bg-gray-100 text-gray-650 px-2.5 py-1 rounded-md">
            {resumes.length} Files
          </span>
        </div>

        {resumes.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-16 text-center bg-gray-50/50">
            <h3 className="font-semibold text-lg text-gray-700">No resumes yet</h3>
            <p className="text-muted-foreground mt-3 text-sm max-w-sm mx-auto">
              Upload your first resume file above to kickstart your automated ATS analytics.
            </p>
          </div>
        ) : (
          <div className="grid gap-5"> 
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="group border rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
              >
               
                <Link
                  href={`/dashboard/resumes/${resume.id}`}
                  className="flex-1 min-w-0 space-y-3 group/link"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg text-gray-800 transition-colors group-hover/link:text-blue-600 truncate">
                      {resume.title}
                    </h3>
                    <ArrowUpRight className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(resume.createdAt).toLocaleDateString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  {resume.analysis && (
                   
                    <div className="mt-4 flex items-start gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-2 min-w-[68px] shrink-0">
                        <span className="text-xl font-extrabold text-gray-900 leading-none">
                          {resume.analysis.score}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium mt-1 uppercase">
                          ATS
                        </span>
                      </div>
                      <p className="text-sm text-gray-650 leading-relaxed self-center line-clamp-2">
                        {resume.analysis.remark}
                      </p>
                    </div>
                  )}
                </Link>

             
                <div className="flex items-center justify-end sm:border-l sm:pl-6 border-gray-100 shrink-0">
                  <form
                    action={async () => {
                      "use server";
                      await prisma.resume.delete({
                        where: { id: resume.id },
                      });
                      redirect("/dashboard/resumes");
                    }}
                  >
                    <button
                      type="submit"
                      className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-150"
                      title="Delete Resume"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
   
    <div className="rounded-2xl border bg-card p-7 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between space-y-0">
        <p className="text-xs font-semibold text-muted-foreground tracking-wider uppercase">
          {title}
        </p>
        <div className="rounded-md bg-gray-50 p-1.5 border border-gray-100">
          {icon}
        </div>
      </div>
      <div className="mt-5">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {value}
        </h2>
      </div>
    </div>
  );
}