import { prisma } from "@/lib/prisma";
import Link from "next/link";
import OptimizeButton from "@/components/resume/optimize-button";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Sparkles, 
  ArrowLeft,
  GitCompare
} from "lucide-react";

export default async function ResumeDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const resume = await prisma.resume.findUnique({
    where: { id },
    include: { analysis: true },
  });

  if (!resume) {
    return (
      <div className="max-w-5xl mx-auto py-16 text-center space-y-4">
        <p className="text-muted-foreground text-lg">Resume not found</p>
        <Link href="/dashboard/resumes" className="text-blue-600 font-medium inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Resumes
        </Link>
      </div>
    );
  }

  const score = resume.analysis?.score ?? 0;

  return (
    // चीजों को चिपकने से रोकने के लिए space-y-12 और py-10 का उपयोग किया है
    <div className="max-w-5xl mx-auto space-y-12 px-4 py-10 md:px-6">
      
      {/* Top Navigation & Header */}
      <div className="space-y-4">
        <Link 
          href="/dashboard/resumes" 
          className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Resumes
        </Link>
        <div className="border-b pb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
            {resume.title}
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Comprehensive ATS & Resume Optimization Report
          </p>
        </div>
      </div>

      {/* Main Score & Remarks Banner (Deeply Padded) */}
      <div className="border rounded-2xl bg-white p-8 md:p-10 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall Performance</span>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed font-medium">
            {resume.analysis?.remark || "Analysis details are not populated for this file."}
          </p>
        </div>
        
        {/* Visual Score Circle/Badge */}
        <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl p-6 min-w-[140px] shrink-0 text-center">
          <span className="text-5xl font-black text-gray-950 tracking-tighter">
            {score}
          </span>
          <span className="text-xs font-semibold text-muted-foreground mt-2 uppercase tracking-wide">
            out of 100
          </span>
        </div>
      </div>

      {/* Action Buttons with Spacing */}
      <div className="flex flex-wrap gap-4 pt-2">
        <Link
          href={`/dashboard/compare`}
          className="flex items-center gap-2 rounded-xl border bg-white text-sm font-medium px-5 py-3 text-gray-700 shadow-sm hover:bg-gray-50 transition-all hover:-translate-y-0.5"
        >
          <GitCompare className="h-3.5 w-3.5 text-gray-500" />
          Compare with JD
        </Link>

        <OptimizeButton resumeId={resume.id} />
      </div>

      {/* Analytics Grid - Increased gap to 8 for breathing room */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Strengths Card */}
        <div className="border bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-3.5 pt-2">
            {(resume.analysis?.strengths as string[])?.map((item, index) => (
              <li key={index} className="text-sm text-gray-650 leading-relaxed flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-505 shrink-0 mt-2 bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses Card */}
        <div className="border bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <h3 className="text-lg font-bold text-gray-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-3.5 pt-2">
            {(resume.analysis?.weaknesses as string[])?.map((item, index) => (
              <li key={index} className="text-sm text-gray-650 leading-relaxed flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Skills Card */}
        <div className="border bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <h3 className="text-lg font-bold text-gray-900">Missing Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2 pt-3">
            {(resume.analysis?.missingSkills as string[])?.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-medium text-xs tracking-wide"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Suggestions Card */}
        <div className="border bg-white rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">Tailoring Suggestions</h3>
          </div>
          <ul className="space-y-3.5 pt-2">
            {(resume.analysis?.suggestions as string[])?.map((item, index) => (
              <li key={index} className="text-sm text-gray-650 leading-relaxed flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}