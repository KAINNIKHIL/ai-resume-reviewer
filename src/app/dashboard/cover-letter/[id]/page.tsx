import { prisma } from "@/lib/prisma";

export default async function CoverLetterResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const coverLetter = await prisma.coverLetter.findUnique({
    where: {
      id,
    },
    include: {
      resume: true,
    },
  });

  if (!coverLetter) {
    return (
      <div className="max-w-4xl mx-auto">
        Cover Letter not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          AI Cover Letter
        </h1>

        <p className="text-muted-foreground mt-2">
          Generated specifically for this job.
        </p>

      </div>

      {/* Info */}

      <div className="grid md:grid-cols-2 gap-6">

        <div className="rounded-xl border p-5">

          <p className="text-sm text-muted-foreground">
            Resume
          </p>

          <h2 className="font-semibold text-lg mt-1">
            {coverLetter.resume.title}
          </h2>

        </div>

        <div className="rounded-xl border p-5">

          <p className="text-sm text-muted-foreground">
            Job Title
          </p>

          <h2 className="font-semibold text-lg mt-1">
            {coverLetter.jobTitle || "Not Detected"}
          </h2>

          {coverLetter.companyName && (
            <p className="text-muted-foreground mt-2">
              {coverLetter.companyName}
            </p>
          )}

        </div>

      </div>

      {/* Cover Letter */}

      <div className="rounded-2xl border bg-white p-8 shadow-sm">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Cover Letter
          </h2>

        </div>

        <div className="whitespace-pre-wrap leading-8 text-[15px]">
          {coverLetter.content}
        </div>

      </div>

    </div>
  );
}