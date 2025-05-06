// components/CreateClient.tsx
"use client";

import { createChallenge } from "@/actions/challengeActions/createChallenge";
import Image from "next/image";
import React, { useState, useRef } from "react";

export default function CreateClient() {
  /** Bilder inkl. Cover‑Flag (isMain) */
  const [images, setImages] = useState<{ url: string; isMain: boolean }[]>([]);
  const [isUploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -------- Bild entfernen (Index) ----------------------------- */
  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  /* -------- Form‑Submit --------------------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    console.log("DEBUG ‑ images vor createChallenge:", images); // <‑‑ hinzufügen
    await createChallenge(images, fd);
  };

  /* -------- Upload‑Handler ------------------------------------ */
  const handleUpload = async (files: FileList | null) => {
    if (!files) return;

    const slotsLeft = 10 - images.length; // ✨ NEW – Limit
    if (slotsLeft <= 0) {
      alert("Maximal 10 Titelbilder erlaubt.");
      return;
    }

    setUploading(true);
    const newImgs: { url: string; isMain: boolean }[] = [];

    for (const file of Array.from(files).slice(0, slotsLeft)) {
      const data = new FormData();
      data.set("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: data });
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        const url = json.url ?? json.secure_url;
        if (url) newImgs.push({ url, isMain: true }); // ist immer Titelbild
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    setImages((prev) => [...prev, ...newImgs]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded space-y-4"
    >
      <h2 className="text-2xl font-bold">Create New ChallengeB</h2>

      {/* Vorschau – jedes Klick löscht Bild */}
      <div className="flex flex-wrap gap-4">
        {images.map((img, idx) => (
          <div key={img.url + idx} className="relative">
            <Image
              src={img.url}
              alt={`Cover ${idx + 1}`}
              width={140}
              height={140}
              className="rounded cursor-pointer"
              onClick={() => removeImage(idx)}
            />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
              ✕
            </span>
          </div>
        ))}
      </div>

      {/* Upload‑Feld */}
      <label className="block text-gray-700">
        {isUploading
          ? "Uploading…"
          : `Titelbild${images.length ? " hinzufügen" : ""} (max 10)`}
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

      {/* 🔁 Restliche Felder (unverändert) */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block text-gray-700">
          Category:
        </label>
        <input
          type="text"
          id="category"
          name="category"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="difficulty" className="block text-gray-700">
          Difficulty:
        </label>
        <input
          type="text"
          id="difficulty"
          name="difficulty"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="duration" className="block text-gray-700">
          Duration (Days):
        </label>
        <input
          type="number"
          id="duration"
          name="duration"
          min="1"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="progress" className="block text-gray-700">
          Progress (%):
        </label>
        <input
          type="number"
          id="progress"
          name="progress"
          min="0"
          max="100"
          step="0.1"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="age" className="block text-gray-700">
          Age:
        </label>
        <input
          type="number"
          id="age"
          name="age"
          min="0"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="gender" className="block text-gray-700">
          Gender:
        </label>
        <input
          type="text"
          id="gender"
          name="gender"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city_address" className="block text-gray-700">
          City Address:
        </label>
        <input
          type="text"
          id="city_address"
          name="city_address"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="goal" className="block text-gray-700">
          Goal:
        </label>
        <input
          type="text"
          id="goal"
          name="goal"
          className="w-full mt-1 p-2 border rounded"
        />
      </div>
      <button
        disabled={isUploading}
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        {isUploading ? "Uploading…" : "Create Challenge"}
      </button>
    </form>
  );
}
