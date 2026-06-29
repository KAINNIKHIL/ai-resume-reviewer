import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import CoverLetterForm from "@/components/cover-letter/cover-letter-form.tsx";

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
    <div className="max-w-7xl mx-auto space-y-8">

      <div>
        <h1 className="text-4xl font-bold">
          AI Cover Letter Generator
        </h1>

        <p className="text-muted-foreground mt-2">
          Select a resume, paste the job description,
          and generate a personalized cover letter.
        </p>
      </div>

      <CoverLetterForm
        resumes={resumes}
      />

    </div>
  );
}