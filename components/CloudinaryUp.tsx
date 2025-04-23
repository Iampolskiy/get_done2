/* "use client";

import React from "react";

export default function CloudinaryUp() {
  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          console.log(file);
        }}
      />
    </div>
  );
} */
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
