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
        {
          message: "Resume not found",
        },
        {
          status: 404,
        }
      );
    }

    const prompt = `
You are an expert ATS Resume Writer and Career Coach.

Your task is to optimize the following resume for Applicant Tracking Systems (ATS) while keeping every fact truthful.

Rules:

- Never invent projects, experience, skills, education, certifications or achievements.
- Keep all information factually correct.
- Improve grammar and readability.
- Rewrite weak bullet points using strong action verbs.
- Make the resume ATS-friendly.
- Improve the professional summary.
- Organize the skills into meaningful categories.
- Preserve the overall meaning of the resume.
- Do not include markdown.
- Return ONLY valid JSON.

Return JSON in this exact format:

{
  "aiSummary": [
    "",
    "",
    "",
    "",
    ""
  ],

  "optimizedSummary": "",

  "optimizedExperience": [],

  "optimizedSkills": {
    "Programming Languages": [],
    "Frontend Technologies": [],
    "Backend Technologies": [],
    "Databases": [],
    "Tools": [],
    "Certifications": []
  },

  "optimizedResume": ""
}

Instructions:

- aiSummary must contain 4-6 short bullet points describing exactly what improvements you made.
- optimizedExperience must contain rewritten experience/project bullet points.
- optimizedSkills must always be an object grouped by category.
- optimizedResume should be a complete ATS-optimized version of the resume as plain text.

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

    let optimization;

    try {
      optimization = JSON.parse(cleanedText);
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

    const savedOptimization =
      await prisma.resumeOptimization.upsert({
        where: {
          resumeId,
        },
        update: {
          aiSummary: 
            optimization.aiSummary,

          optimizedSummary:
            optimization.optimizedSummary,

          optimizedExperience:
            optimization.optimizedExperience,

          optimizedSkills:
            optimization.optimizedSkills,

          optimizedResume:
            optimization.optimizedResume,
        },
        create: {
          resumeId,

          aiSummary: 
            optimization.aiSummary,

          optimizedSummary:
            optimization.optimizedSummary,

          optimizedExperience:
            optimization.optimizedExperience,

          optimizedSkills:
            optimization.optimizedSkills,

          optimizedResume:
            optimization.optimizedResume,
        },
      });

    return NextResponse.json(savedOptimization);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Optimization failed",
      },
      {
        status: 500,
      }
    );
  }
}