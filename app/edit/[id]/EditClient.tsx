// app/allmychallenges/[id]/EditClient.tsx
"use client";

import { editChallenge } from "@/actions/challengeActions/editChallenge";
import { Challenge } from "@/types/types";
import Image from "next/image";
import React, { useState, useRef } from "react";

type Props = { challenge: Challenge };

export default function EditClient({ challenge }: Props) {
  /** Nur Titelbilder (isMain === true) */
  const [images, setImages] = useState<string[]>(
    challenge.images?.filter((i) => i.isMain).map((i) => i.url) ?? []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setUploading] = useState(false);

  /* ---------- Bild entfernen -------------------- */
  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  /* ---------- Submit --------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    await editChallenge(fd, images); // ✨ NEW
  };

  /* ---------- Upload‑Handler ------------------- */
  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    const slotsLeft = 10 - images.length; // ✨ NEW
    if (slotsLeft <= 0) {
      alert("Maximal 10 Titelbilder erlaubt.");
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of Array.from(files).slice(0, slotsLeft)) {
      const data = new FormData();
      data.set("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: data });
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        const url = json.url ?? json.secure_url;
        if (url) newUrls.push(url);
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    setImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded space-y-4"
    >
      <h2 className="text-2xl font-bold">Edit {challenge.title}</h2>

      {/* Vorschau */}
      <div className="flex flex-wrap gap-4">
        {images.map((url, idx) => (
          <div key={url + idx} className="relative">
            <Image
              src={url}
              alt={`Cover ${idx + 1}`}
              width={160}
              height={160}
              className="rounded-lg cursor-pointer"
              onClick={() => removeImage(idx)}
            />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
              ✕
            </span>
          </div>
        ))}
      </div>

      {/* Uploadfeld */}
      <label className="block text-gray-700">
        {isUploading ? "Uploading…" : "Titelbild(er) hinzufügen (max 10)"}
      </label>
      <input
        ref={fileInputRef}
        type="file"
        disabled={isUploading}
        className="w-full mt-1 p-2 border rounded"
        onChange={(e) => handleUpload(e.target.files)}
        multiple
        accept="image/*"
      />

      {/* ---- restliche Felder (unverändert) ---- */}
      <input type="hidden" name="id" defaultValue={challenge.id} />

      {/* Übrige Formular‑Felder … (unverändert) ---------------------- */}
      <input type="hidden" name="id" defaultValue={challenge.id} />
      <label className="block text-gray-700">Title</label>
      <input
        name="title"
        defaultValue={challenge.title}
        className="w-full p-2 border rounded"
      />
      <label className="block text-gray-700">Category</label>
      <input
        name="category"
        defaultValue={challenge.category ?? ""}
        className="w-full p-2 border rounded"
      />
      <label className="block text-gray-700">Difficulty</label>
      <input
        name="difficulty"
        defaultValue={challenge.difficulty ?? ""}
        className="w-full p-2 border rounded"
      />
      {/* … weitere Felder ... */}

      <button
        type="submit"
        disabled={isUploading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        Speichern
      </button>
    </form>
  );
}
