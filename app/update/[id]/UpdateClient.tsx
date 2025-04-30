"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createUpdate } from "@/actions/challengeActions/updateChallenge";
import { Challenge } from "@/types/types";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

type UpdateClientProps = {
  challenge: Challenge;
};

export default function UpdateClient({ challenge }: UpdateClientProps) {
  const params = useSearchParams();
  const editSuccess = params.get("editSuccess");

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    initial: Math.max(challenge.updates.length - 1, 0),
    slides: {
      perView: 1.1,
      spacing: 15,
      origin: "center",
    },
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [formattedDates, setFormattedDates] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Datum formatieren
  useEffect(() => {
    const dates = challenge.updates.map((u) =>
      new Intl.DateTimeFormat("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(u.date))
    );
    setFormattedDates(dates);
  }, [challenge.updates]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      const data = new FormData();
      data.set("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (json.url) {
        formData.append("imageUrls", json.url); // WICHTIG: Name ist imageUrls
      }
    }

    await createUpdate(challenge.id.toString(), formData);
  };

  return (
    <section className="bg-gray-50 min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
          <Link
            href="/allmychallenges"
            className="text-blue-600 hover:underline"
          >
            ← Zurück zu meinen Zielen
          </Link>
        </div>

        {/* Carousel */}
        <div ref={sliderRef} className="keen-slider">
          {challenge.updates.map((u, idx) => (
            <div
              key={u.id}
              className="keen-slider__slide bg-white rounded-2xl shadow p-6 flex flex-col gap-4"
            >
              <span className="text-sm text-gray-500">
                {formattedDates[idx]}
              </span>
              <p className="text-gray-800">{u.updateText}</p>

              {u.images && u.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {u.images.map((img, i) => (
                    <Image
                      key={i}
                      src={img.url}
                      alt={`Bild ${i + 1}`}
                      width={200}
                      height={200}
                      className="rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Formular */}
        <div className="bg-white rounded-xl shadow p-6">
          {editSuccess && (
            <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
              Eintrag gespeichert!
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="hidden" name="challengeId" value={challenge.id} />

            <label className="block text-sm font-medium text-gray-700">
              Neuer Tages-Eintrag für heute
            </label>
            <textarea
              name="updateText"
              rows={3}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-200 focus:border-blue-500"
            />

            {/* 🔄 Upload & Vorschau */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bilder hinzufügen
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="mt-1 block w-full"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    const fileArray = Array.from(files);
                    setFilesToUpload((prev) => [...prev, ...fileArray]);
                    const previews = fileArray.map((file) =>
                      URL.createObjectURL(file)
                    );
                    setPreviewImages((prev) => [...prev, ...previews]);
                  }
                }}
              />
            </div>

            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {previewImages.map((src, index) => (
                  <Image
                    key={index}
                    src={src}
                    alt={`Vorschau ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Speichern
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
