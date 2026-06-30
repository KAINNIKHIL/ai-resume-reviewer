"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ResumeCard from "@/components/compare/resume-card";
import JobDescriptionCard from "@/components/compare/job-description-card";
import { FileText } from "lucide-react";

interface Resume {
  id: string;
  title: string;
  createdAt: Date;
  analysis: {
    score: number;
  } | null;
}

interface Props {
  resumes: Resume[];
}

export default function CoverLetterForm({
  resumes,
}: Props) {
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState("");
  const [loadingResumeId, setLoadingResumeId] = useState<string | null>(null);

  async function handleGenerate(resumeId: string) {
    if (!jobDescription.trim()) {
      alert("Please paste the Job Description.");
      return;
    }

    try {
      setLoadingResumeId(resumeId);

      const response = await fetch("/api/resume/cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to generate cover letter."
        );
      }

      router.push(`/dashboard/cover-letter/${data.id}`);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoadingResumeId(null);
    }
  }

  return (
    
    <div className="grid lg:grid-cols-5 gap-8 items-start">

      
      <div className="lg:col-span-3">
        <JobDescriptionCard
          value={jobDescription}
          onChange={setJobDescription}
        />
      </div>


      <div className="lg:col-span-2 space-y-4">


        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <h2 className="text-xl font-bold text-gray-900">
              Your Resumes
            </h2>
          </div>
          
          <span className="text-xs font-semibold bg-gray-100 text-gray-650 px-2 py-0.5 rounded-md">
            {resumes.length} Total
          </span>
        </div>

        {/* Scrollable container setup so cards stay neat even if the left side text is tall */}
        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
          {resumes.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center bg-gray-50/50">
              <p className="font-semibold text-gray-700">
                No resumes uploaded
              </p>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
                Upload a resume first before compiling an AI letter.
              </p>
            </div>
          ) : (
            resumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                loading={loadingResumeId === resume.id}
                onCompare={() => handleGenerate(resume.id)}
                buttonText="Generate Cover Letter"
              />
            ))
          )}
        </div>

      </div>

    </div>
  );
}