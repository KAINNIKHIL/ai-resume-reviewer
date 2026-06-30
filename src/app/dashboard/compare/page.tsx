import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CompareForm from "@/components/compare/compare-form";
import { GitCompare, Sparkles, ShieldCheck, FileText } from "lucide-react";

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
    
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 space-y-16">
      
      {/* Hero Section */}
      <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white shadow-sm">
        
        <div className="p-8 md:p-12 space-y-6">
          
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/10 text-white rounded-lg backdrop-blur">
              <GitCompare className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">ATS Matcher</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Compare Resume with <br className="hidden sm:inline" /> Job Description
          </h1>

          <p className="max-w-3xl text-slate-300 text-base md:text-lg leading-relaxed pt-2">
            Select one of your uploaded resumes and compare it against a job description. 
            Receive a detailed compatibility score, missing skills, strengths, weaknesses, 
            and personalized improvement suggestions.
          </p>

          
          <div className="pt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-5 py-3.5 backdrop-blur min-w-[150px]">
              <FileText className="h-4 w-4 text-blue-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Resumes</p>
                <p className="text-xl font-bold mt-0.5">{resumes.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-5 py-3.5 backdrop-blur min-w-[150px]">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">AI Analysis</p>
                <p className="text-xl font-bold mt-0.5">Instant</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-5 py-3.5 backdrop-blur min-w-[150px]">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Match Report</p>
                <p className="text-xl font-bold mt-0.5">ATS Ready</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      
      <div className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm">
        <CompareForm
          resumes={resumes}
          jobMatches={jobMatches}
        />
      </div>
      
    </div>
  );
}