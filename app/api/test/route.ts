"use server";
import { NextRequest, NextResponse } from "next/server";
import { pinata } from "@/utils/config";

/* export const config = {
  api: {
    bodyparser: false,
  },
}; */

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    console.log("Request Body:", data);
    const file: File | null = data.get("file") as unknown as File;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const uploaddData = await pinata.upload.file(file);
    const url = await pinata.gateways.createSignedURL({
      cid: uploaddData.cid,
      expires: 3600,
    });
    return NextResponse.json(url, { status: 200 });
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
