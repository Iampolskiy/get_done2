"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createUpdate } from "@/actions/challengeActions/updateChallenge";
import { Challenge } from "@/types/types";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { Trash2 } from "lucide-react"; // 🔄 Lösch-Icon

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
  const [imageDescriptions, setImageDescriptions] = useState<string[]>([]); // 🔄 Beschreibung je Bild
  const [descVisibleIndex, setDescVisibleIndex] = useState<number | null>(null); // 🔄 Welches Bild ist „aktiv“?

  const [formattedDates, setFormattedDates] = useState<string[]>([]);
  const [isUploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setUploading(true);
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    // Dateien und Beschreibungen in gleicher Reihenfolge verarbeiten 🔄
    for (const [idx, file] of filesToUpload.entries()) {
      // 🔄
      const data = new FormData();
      data.set("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url) {
        formData.append("imageUrls", json.url);
        if (imageDescriptions[idx]) {
          // 🔄
          formData.append("imageTexts", imageDescriptions[idx]); // 🔄
        }
      }
    }

    await createUpdate(challenge.id.toString(), formData);
    setUploading(false);
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

        {/* Challenge-Bild */}
        <div className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden">
          {challenge.images && challenge.images.length > 0 && (
            <div className="relative h-64 w-full">
              <Image
                src={challenge.images[0].url}
                alt={challenge.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-xl"
              />
            </div>
          )}
        </div>

        {/* Carousel */}
        <div ref={sliderRef} className="keen-slider">
          {challenge.updates.map((u, idx) => (
            <div
              key={u.id}
              className="keen-slider__slide bg-white rounded-2xl shadow p-4 md:p-6 flex flex-col gap-4"
            >
              {u.images && u.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {u.images.map((img, i) => (
                    <Image
                      key={i}
                      src={img.url}
                      alt={`Bild ${i + 1}`}
                      width={300}
                      height={200}
                      className="rounded-md object-cover w-full h-auto"
                    />
                  ))}
                </div>
              )}
              <div>
                <span className="text-sm text-gray-500">
                  {formattedDates[idx]}
                </span>
                <p className="text-gray-800 mt-2">{u.content}</p>
              </div>
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
              Neuer Tages-Eintrag
            </label>
            <textarea
              name="updateText"
              rows={3}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-200 focus:border-blue-500"
            />

            {/* Bild-Upload */}
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
                  if (!files) return;

                  const fileArray = Array.from(files);
                  setFilesToUpload((prev) => [...prev, ...fileArray]);
                  setPreviewImages((prev) => [
                    ...prev,
                    ...fileArray.map((file) => URL.createObjectURL(file)),
                  ]);
                  setImageDescriptions((prev) => [
                    ...prev,
                    ...new Array(fileArray.length).fill(""),
                  ]); // 🔄
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              />
            </div>

            {/* Vorschau & Beschriftung */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    {/* Bild */}
                    <Image
                      src={src}
                      alt={`Vorschau ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-md object-cover cursor-pointer hover:ring-4 hover:ring-green-400" // 🔄 grüner Hover-Rand
                      onClick={
                        () =>
                          setDescVisibleIndex((prev) =>
                            prev === index ? null : index
                          ) // 🔄 Input toggeln
                      }
                    />

                    {/* Löschen-Button */}
                    <button
                      type="button"
                      onClick={() => {
                        // Bild + Datei + Beschreibung entfernen 🔄
                        setPreviewImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                        setFilesToUpload((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                        setImageDescriptions((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                        if (descVisibleIndex === index)
                          setDescVisibleIndex(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-2 shadow-lg hover:bg-red-700"
                    >
                      <Trash2 size={20} /> {/* etwas größer */} {/* 🔄 */}
                    </button>

                    {/* Beschriftungs-Input */}
                    {descVisibleIndex === index && ( // 🔄
                      <input
                        type="text"
                        placeholder="Bildbeschreibung …"
                        value={imageDescriptions[index]}
                        onChange={(e) =>
                          setImageDescriptions((prev) =>
                            prev.map((val, i) =>
                              i === index ? e.target.value : val
                            )
                          )
                        }
                        className="mt-2 w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-200 focus:border-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isUploading ? "Speichern…" : "Speichern"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
