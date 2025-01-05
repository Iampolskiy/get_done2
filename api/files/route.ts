import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadData = await pinata.upload.file(file);
  } catch (error) {
    {
      console.log(error);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }
  }
}
