import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ai } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { resumeId } = await request.json();

    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { message: "Resume not found" },
        { status: 404 }
      );
    }

    const prompt = `
You are an expert ATS and resume reviewer.

Analyze the following resume.

Return ONLY valid JSON in this format:

{
  "score": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}

Resume:

${resume.extractedText}
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

let analysis;

try {
  analysis = JSON.parse(cleanedText);
} catch (error) {
  console.error("JSON Parse Error:", cleanedText);

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

return NextResponse.json({
  analysis,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Analysis failed",
      },
      {
        status: 500,
      }
    );
  }
}