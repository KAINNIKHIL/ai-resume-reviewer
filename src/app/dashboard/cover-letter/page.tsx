import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CoverLetterForm from "@/components/cover-letter/cover-letter-form.tsx";
import { FileEdit } from "lucide-react";

export default async function CoverLetterPage() {
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

  return (
   
    <div className="max-w-5xl mx-auto space-y-12 px-4 py-10 md:px-6">

  
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <FileEdit className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">AI Writer</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            AI Cover Letter Generator
          </h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">
            Select a resume, paste the job description, and generate a tailored, professional cover letter.
          </p>
        </div>
      </div>

     
      <div className="bg-white rounded-2xl border p-6 md:p-8 shadow-sm">
        <CoverLetterForm resumes={resumes} />
      </div>

    </div>
  );
}