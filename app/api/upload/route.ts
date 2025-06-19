import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { currentUser } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const me = await currentUser();
if (!me) throw new Error("Benutzer ist nicht authentifiziert");
const email = me?.emailAddresses?.[0]?.emailAddress;
console.log(email);

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
