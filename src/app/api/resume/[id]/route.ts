import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.resume.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}