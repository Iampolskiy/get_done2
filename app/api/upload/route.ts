import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mime = file.type;
  const base64Data = buffer.toString("base64");
  const dataUri = `data:${mime};base64,${base64Data}`;

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "uploads", // Optional: Ordner in Cloudinary
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

/* 
upload preset: IMG_upload1
CloudName: dndvvdmtf
*/

/* import { pinata } from "@/utils/config"; */

/* export const config = {
  api: {
    bodyparser: false,
  },
}; */

/* export async function POST(request: NextRequest) {
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
} */
