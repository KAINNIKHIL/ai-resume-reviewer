import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import { extractTextFromPDF } from "@/lib/pdf";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    // 1. Double check that it's a file and it's actually a PDF
    if (!file || file.size === 0) {
      return NextResponse.json(
        { message: "No file uploaded or file is empty" },
        { status: 400 }
      );
    }

    if (!file.type.includes("pdf") && !file.name.endsWith(".pdf")) {
      return NextResponse.json(
        { message: "Invalid file type. Please upload a PDF." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extractedText = await extractTextFromPDF(buffer);

    // Save resume in database
    const resume = await prisma.resume.create({
      data: {
        title: file.name,
        fileUrl: file.name, // temporary until cloud storage
        extractedText,
        userId: user.id,
      },
    });

    // 2. Explicitly surface 'id' at the root level if your frontend expects data.id
    return NextResponse.json({
      id: resume.id, 
      message: "Resume saved successfully",
      textLength: extractedText.length,
      resume,
    });

  } catch (error) {
    // Crucial: Stringify the error message so you get details in the console logs
    console.error("Upload Error Details:", error instanceof Error ? error.message : error);

    return NextResponse.json(
      {
        message: "Failed to process resume",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      {
        status: 500,
      }
    );
  }
}