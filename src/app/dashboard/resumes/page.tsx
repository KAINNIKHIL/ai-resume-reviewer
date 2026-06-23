import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ResumeUpload from "@/components/upload/resume-upload";

export default async function ResumesPage() {
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Resume Upload
        </h1>

        <p className="text-muted-foreground">
          Upload and analyze your resumes.
        </p>
      </div>

      <ResumeUpload />

      <div>
        <h2 className="text-2xl font-semibold mb-4">
          My Resumes
        </h2>

        <div className="space-y-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="border rounded-lg p-4"
            >
              <h3 className="font-medium">
                {resume.title}
              </h3>

              <p className="text-sm text-muted-foreground">
                {resume.createdAt.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}