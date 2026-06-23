import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import pdfParse from "pdf-parse";

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

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
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

    // Convert uploaded PDF to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    // Save resume in database
    const resume = await prisma.resume.create({
      data: {
        title: file.name,
        fileUrl: file.name, // temporary until cloud storage
        extractedText,
        userId: user.id,
      },
    });

    return NextResponse.json({
      message: "Resume saved successfully",
      textLength: extractedText.length,
      resume,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    return NextResponse.json(
      {
        message: "Failed to process resume",
      },
      {
        status: 500,
      }
    );
  }
}