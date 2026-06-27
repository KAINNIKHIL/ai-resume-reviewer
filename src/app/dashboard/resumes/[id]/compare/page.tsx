import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CompareForm from "./compareForm";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ComparePage({
  params,
}: Props) {
  const { id } = await params;

  const resume = await prisma.resume.findUnique({
    where: {
      id,
    },
  });

  if (!resume) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Job Description Match
        </h1>

        <p className="text-muted-foreground mt-2">
          Compare your resume with a job description
          using AI.
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="font-semibold text-lg">
          Resume
        </h2>

        <p className="mt-2 text-muted-foreground">
          {resume.title}
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <CompareForm resumeId={resume.id} />
      </div>
    </div>
  );
}