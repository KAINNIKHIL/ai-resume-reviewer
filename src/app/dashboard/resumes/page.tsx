import ResumeUpload from "@/components/upload/resume-upload";

export default function ResumesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Resume Upload
        </h1>

        <p className="text-muted-foreground">
          Upload and analyze your resumes.
        </p>
      </div>

      <ResumeUpload />
    </div>
  );
}