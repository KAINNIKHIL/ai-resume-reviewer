import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
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

  const resume = await prisma.resume.create({
    data: {
      title: file.name,
      fileUrl: file.name, // temporary
      userId: user.id,
    },
  });

  return NextResponse.json({
    message: "Resume saved successfully",
    resume,
  });
}