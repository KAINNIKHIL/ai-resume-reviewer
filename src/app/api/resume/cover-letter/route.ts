import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ai } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { resumeId, jobDescription } =
      await request.json();

    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
      },
    });

    if (!resume) {
      return NextResponse.json(
        {
          message: "Resume not found",
        },
        {
          status: 404,
        }
      );
    }

    const prompt = `
You are an expert career coach and professional recruiter.

Write a personalized cover letter based ONLY on the resume and job description below.

Rules:

- Never invent experience.
- Never invent projects.
- Never invent achievements.
- Use only information from the resume.
- Match the job description as much as possible.
- Professional and confident tone.
- Length: 300-450 words.
- Return ONLY valid JSON.

Format:

{
  "companyName": "",
  "jobTitle": "",
  "coverLetter": ""
}

Resume:

${resume.extractedText}

Job Description:

${jobDescription}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText = response.text ?? "";

    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let result;

    try {
      result = JSON.parse(cleanedText);
    } catch {
      console.error(cleanedText);

      return NextResponse.json(
        {
          message: "Invalid AI response",
        },
        {
          status: 500,
        }
      );
    }

    const coverLetter =
      await prisma.coverLetter.create({
        data: {
          resumeId,

          companyName:
            result.companyName || null,

          jobTitle:
            result.jobTitle || null,

          jobDescription,

          content:
            result.coverLetter,
        },
      });

    return NextResponse.json({
      id: coverLetter.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Cover Letter generation failed",
      },
      {
        status: 500,
      }
    );
  }
}