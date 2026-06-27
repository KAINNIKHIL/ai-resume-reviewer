import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ai } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { resumeId, jobDescription } =
      await request.json();

    if (!resumeId || !jobDescription) {
      return NextResponse.json(
        {
          message:
            "Resume ID and Job Description are required.",
        },
        {
          status: 400,
        }
      );
    }

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
You are an ATS expert.

Compare the resume with the following job description.

Return ONLY valid JSON.

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingKeywords": [],
  "suggestions": []
}

Resume:
${resume.extractedText}

Job Description:
${jobDescription}
`;

    const response =
      await ai.models.generateContent({
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
      return NextResponse.json(
        {
          message: "Invalid AI response",
          rawResponse: cleanedText,
        },
        {
          status: 500,
        }
      );
    }

    const jobMatch = await prisma.jobMatch.create({
  data: {
    resumeId,
    jobDescription,
    matchScore: result.matchScore,
    matchedSkills: result.matchedSkills,
    missingKeywords: result.missingKeywords,
    suggestions: result.suggestions,
  },
});

return NextResponse.json({
  id: jobMatch.id,
  ...result,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Comparison failed",
      },
      {
        status: 500,
      }
    );
  }
}