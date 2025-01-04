// app/api/sign-upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server"; // Clerk-Integration

// Cloudinary konfigurieren
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request); // Clerk Authentifizierung

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { folder } = await request.json();

    const timestamp = Math.floor(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* // components/CloudinaryUpload.tsx

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const CloudinaryUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { isSignedIn } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const timestamp = Math.floor(Date.now() / 1000);
    const response = await fetch("/api/sign-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timestamp, folder: "test" }),
    });

    if (!response.ok) {
      console.error("Failed to get signature");
      setUploading(false);
      return;
    }

    const {
      signature,
      api_key,
      timestamp: ts,
      cloud_name,
    } = await response.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", ts.toString());
    formData.append("signature", signature);
    formData.append("folder", "dein_ordner");

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloud_name}/test/1`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      console.error("Upload failed");
      setUploading(false);
      return;
    }

    const data = await cloudinaryResponse.json();
    setImageUrl(data.secure_url);
    setUploading(false);
  };

  if (!isSignedIn) {
    return <p>Bitte melde dich an, um Dateien hochzuladen.</p>;
  }

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Hochladen..." : "Hochladen zu Cloudinary"}
      </button>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Hochgeladen"
          style={{ marginTop: "20px", maxWidth: "300px" }}
        />
      )}
    </div>
  );
};

export default CloudinaryUpload;
 */
