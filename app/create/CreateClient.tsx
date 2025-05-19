"use client";

import { createChallenge } from "@/actions/challengeActions/createChallenge";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Info } from "lucide-react";

export default function CreateClient() {
  const [images, setImages] = useState<{ url: string; isMain: boolean }[]>([]);
  const [isUploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showDifficultyInfo, setShowDifficultyInfo] = useState(false);
  const [showDurationInfo, setShowDurationInfo] = useState(false);
  const [durationEnabled, setDurationEnabled] = useState(false);
  const [customCategory, setCustomCategory] = useState(false);

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formEl = e.currentTarget as HTMLFormElement;
    if (!durationEnabled) {
      const dur = formEl.querySelector<HTMLInputElement>("#duration");
      if (dur) dur.value = "0";
    }
    if (customCategory) {
      const cat = formEl.querySelector<HTMLSelectElement>("#category");
      if (cat) cat.value = "";
    }
    const fd = new FormData(formEl);
    await createChallenge(images, fd);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    const slots = 1 - images.length;
    if (slots <= 0) {
      alert("Maximal 1 Titelbild erlaubt.");
      return;
    }
    setUploading(true);
    const uploaded: { url: string; isMain: boolean }[] = [];
    for (const file of Array.from(files).slice(0, slots)) {
      const data = new FormData();
      data.set("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: data });
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        const url = json.url ?? json.secure_url;
        if (url) uploaded.push({ url, isMain: true });
      } catch {
        console.error("Upload fehlgeschlagen");
      }
    }
    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    fileInputRef.current!.value = "";
  };

  const slotsLeft = 1 - images.length;
  const commonCategories = [
    "Fitness",
    "Ernährung",
    "Produktivität",
    "Lernen",
    "Meditation",
    "Kreativität",
    "Lesen",
    "Sprachen",
    "Reisen",
    "Selbstpflege",
  ];

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm space-y-10"
      >
        {/* Überschrift */}
        <h2
          className="text-4xl sm:text-5xl font-extrabold text-center mb-10
                       bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent"
        >
          Neue Herausforderung erstellen
        </h2>

        {/* Bild-Vorschau */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => removeImage(idx)}
              className="relative h-32 w-32 rounded-lg overflow-hidden border-2 border-transparent hover:border-red-500 transition duration-200 group cursor-pointer"
            >
              <Image
                src={img.url}
                alt={`Titelbild ${idx + 1}`}
                fill
                className="object-cover filter transition duration-200 group-hover:grayscale"
              />
            </div>
          ))}
        </div>

        {/* Eingabe-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Titel */}
          <div className="sm:col-span-2">
            <label
              htmlFor="title"
              className="block text-white font-medium mb-1"
            >
              Titel
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="z. B. 100 Tage ohne Zucker"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none"
            />
          </div>

          {/* Upload */}
          <div className="sm:col-span-2">
            <label className="block text-white font-medium mb-1">
              {isUploading
                ? "Lädt hoch…"
                : slotsLeft > 0
                ? "Titelbild auswählen"
                : "Kein Platz"}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              disabled={isUploading || slotsLeft <= 0}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
              onChange={(e) => handleUpload(e.currentTarget.files)}
              accept="image/*"
            />
          </div>

          {/* Zielbeschreibung */}
          <div className="sm:col-span-2">
            <label htmlFor="goal" className="block text-white font-medium mb-1">
              Zielbeschreibung
            </label>
            <textarea
              id="goal"
              name="goal"
              rows={6}
              placeholder="z. B. Ich möchte meine Fitness verbessern…"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-2xl focus:outline-none resize-vertical"
            />
          </div>

          {/* Kategorie */}
          <div className="sm:col-span-2">
            {/* Switch */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-medium">Kategorie</span>
              <div
                onClick={() => setCustomCategory((v) => !v)}
                className={`flex items-center cursor-pointer select-none transition-colors duration-200 ${
                  customCategory ? "text-teal-300" : "text-white"
                }`}
              >
                <span className="mr-2 text-sm">Eigene</span>
                <div
                  className={`w-10 h-6 rounded-full p-1 ${
                    customCategory
                      ? "bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.7)]"
                      : "bg-white/20"
                  } transition-colors duration-200`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                      customCategory ? "translate-x-4" : ""
                    }`}
                  />
                </div>
              </div>
            </div>
            {customCategory ? (
              <input
                type="text"
                id="category"
                name="category"
                placeholder="Eigene Kategorie eingeben…"
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none"
              />
            ) : (
              <select
                id="category"
                name="category"
                required
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none"
              >
                <option value="">Bitte wählen…</option>
                {commonCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Schwierigkeitsgrad */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-medium">Schwierigkeitsgrad</span>
              <Info
                size={16}
                className="cursor-pointer hover:text-teal-300 text-white"
                onClick={() => setShowDifficultyInfo(true)}
              />
            </div>
            <select
              id="difficulty"
              name="difficulty"
              required
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none"
            >
              <option value="">Bitte wählen…</option>
              <option value="1">1 – kann jedes Kind</option>
              <option value="2">2 – nicht so einfach</option>
              <option value="3">3 – schon anspruchsvoll</option>
              <option value="4">4 – wird hart</option>
              <option value="5">5 – unmöglich</option>
            </select>
          </div>

          {/* Stadt */}
          <div>
            <label
              htmlFor="city_address"
              className="block text-white font-medium mb-1"
            >
              Stadt
            </label>
            <input
              type="text"
              id="city_address"
              name="city_address"
              placeholder="z. B. Berlin"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none"
            />
          </div>

          {/* Dauer */}
          <div>
            {/* Switch + Info */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-medium">Dauer</span>
              <div className="flex items-center gap-3">
                <Info
                  size={16}
                  className="cursor-pointer hover:text-purple-500 text-white"
                  onClick={() => setShowDurationInfo(true)}
                />
                <div
                  onClick={() => setDurationEnabled((v) => !v)}
                  className={`flex items-center cursor-pointer select-none transition-colors duration-200 ${
                    durationEnabled ? "text-teal-300" : "text-white"
                  }`}
                >
                  <span className="mr-2 text-sm">Eigene</span>
                  <div
                    className={`w-10 h-6 rounded-full p-1 ${
                      durationEnabled
                        ? "bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.7)]"
                        : "bg-white/20"
                    } transition-colors duration-200`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
                        durationEnabled ? "translate-x-4" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              disabled={!durationEnabled}
              placeholder={durationEnabled ? "z. B. 30" : "unendlich"}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <button
          disabled={isUploading}
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold shadow-lg hover:brightness-110 transition disabled:opacity-50"
        >
          {isUploading ? "Lädt hoch…" : "Herausforderung erstellen"}
        </button>
      </form>

      {/* Schwierigkeit-Modal */}
      {showDifficultyInfo && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowDifficultyInfo(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md mx-4 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">Schwierigkeitsgrad</h3>
            <p>Erklärung zu den Stufen 1–5, wähle nach Gefühl.</p>
            <button
              onClick={() => setShowDifficultyInfo(false)}
              className="mt-4 w-full py-2 bg-teal-400 text-white rounded-lg hover:bg-teal-500 transition"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}

      {/* Dauer-Modal mit neuem Farbschema */}
      {showDurationInfo && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowDurationInfo(false)}
        >
          <div
            className="bg-purple-50 rounded-lg max-w-md mx-4 p-6 space-y-4 border border-purple-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-purple-700">Dauer-Modi</h3>
            <p>
              <strong className="text-purple-600">Unendlich:</strong> kein
              Enddatum.
              <br />
              <strong className="text-purple-600">Zeit setzen:</strong> Trage
              eine Anzahl Tage ein.
            </p>
            <button
              onClick={() => setShowDurationInfo(false)}
              className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Verstanden
            </button>
          </div>
        </div>
      )}
    </>
  );
}
