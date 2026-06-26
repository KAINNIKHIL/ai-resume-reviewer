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

Return ONLY valid JSON:

{
  "score": 0,
  "remark": "",
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": []
}
  Remark Guidelines:
90-100: Excellent Resume - Ready for top-tier applications
80-89: Strong Resume - Minor improvements needed
70-79: Good Resume - Some optimization recommended
60-69: Average Resume - Needs improvement
0-59: Needs Significant Work

Each suggestion must be one concise sentence.
Do not use markdown.
Do not use **bold**.
Do not use labels followed by colons.
Return plain text only.

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
  console.log("Parsed Analysis:");
console.log(analysis);
  await prisma.analysis.upsert({
  where: {
    resumeId: resume.id,
  },
  update: {
    score: analysis.score,
    remark: analysis.remark,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    missingSkills: analysis.missingSkills,
    suggestions: analysis.suggestions,
  },
  create: {
    score: analysis.score,
    remark: analysis.remark,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    missingSkills: analysis.missingSkills,
    suggestions: analysis.suggestions,
    resumeId: resume.id,
  },
});

} catch (error) {
  console.error("JSON Parse Error");
  console.error(error);
  console.error(cleanedText);

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