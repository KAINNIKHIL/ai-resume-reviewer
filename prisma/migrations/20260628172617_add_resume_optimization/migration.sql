-- CreateTable
CREATE TABLE "ResumeOptimization" (
    "id" TEXT NOT NULL,
    "originalSummary" TEXT,
    "optimizedSummary" TEXT,
    "originalExperience" JSONB,
    "optimizedExperience" JSONB,
    "originalSkills" JSONB,
    "optimizedSkills" JSONB,
    "optimizedResume" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeOptimization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResumeOptimization_resumeId_key" ON "ResumeOptimization"("resumeId");

-- AddForeignKey
ALTER TABLE "ResumeOptimization" ADD CONSTRAINT "ResumeOptimization_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
