"use client";

import { createChallenge } from "@/actions/challengeActions/createChallenge";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Info } from "lucide-react";

export default function CreateClient() {
  const [images, setImages] = useState<{ url: string; isMain: boolean }[]>([]);
  const [isUploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal-Flags
  const [showNameInfo, setShowNameInfo] = useState(false);
  const [showCoverInfo, setShowCoverInfo] = useState(false);
  const [showDescInfo, setShowDescInfo] = useState(false);
  const [showCategoryInfo, setShowCategoryInfo] = useState(false);
  const [showDifficultyInfo, setShowDifficultyInfo] = useState(false);
  const [showCityInfo, setShowCityInfo] = useState(false);
  const [showDurationInfo, setShowDurationInfo] = useState(false);

  // Switch-States
  const [customCategory, setCustomCategory] = useState(false);
  const [durationEnabled, setDurationEnabled] = useState(false);

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
  const slotsLeft = 1 - images.length;

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleUpload = async (files: FileList | null) => {
    if (!files) return;
    if (slotsLeft <= 0) {
      alert("Maximal 1 Coverbild erlaubt.");
      return;
    }
    setUploading(true);
    const uploaded: { url: string; isMain: boolean }[] = [];
    for (const file of Array.from(files).slice(0, slotsLeft)) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    if (!durationEnabled) {
      form.querySelector<HTMLInputElement>("#duration")!.value = "0";
    }
    if (customCategory) {
      form.querySelector<HTMLSelectElement>("#category")!.value = "";
    }
    const fd = new FormData(form);
    await createChallenge(images, fd);
  };

  return (
    <>
      {/* Ausblenden “Keine ausgewählt” */}
      <style jsx global>{`
        input[type="file"]::-webkit-file-upload-text {
          display: none;
        }
        input[type="file"]::-moz-file-upload-text {
          display: none;
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mt-20 mx-auto p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm space-y-10"
      >
        {/* Überschrift */}
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
          Neue Herausforderung erstellen
        </h2>

        {/* Cover-Vorschau */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => removeImage(idx)}
              className="relative h-32 w-32 rounded-lg overflow-hidden border-2 border-transparent hover:border-red-500 transition group cursor-pointer"
            >
              <Image
                src={img.url}
                alt={`Cover ${idx + 1}`}
                fill
                className="object-cover filter transition group-hover:grayscale"
              />
            </div>
          ))}
        </div>

        {/* Eingabe-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div className="sm:col-span-2 space-y-1">
            <div className="flex items-center">
              <label htmlFor="title" className="text-white mr-2 font-medium">
                Name
              </label>
              <Info
                size={16}
                className="cursor-pointer text-white hover:text-teal-300"
                onClick={() => setShowNameInfo(true)}
              />
            </div>
            <input
              type="text"
              id="title"
              name="title"
              required
              placeholder="z. B. 100 Tage ohne Zucker"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none"
            />
          </div>

          {/* Cover-Upload */}
          <div className="sm:col-span-2 space-y-1">
            <div className="flex items-center">
              <label className="text-white mr-2 font-medium">
                {isUploading
                  ? "Lädt hoch…"
                  : slotsLeft > 0
                  ? "Coverbild auswählen"
                  : "Kein Platz"}
              </label>
              <Info
                size={16}
                className="cursor-pointer text-white hover:text-teal-300"
                onClick={() => setShowCoverInfo(true)}
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              disabled={isUploading || slotsLeft <= 0}
              className="w-full p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
              onChange={(e) => handleUpload(e.currentTarget.files)}
              accept="image/*"
            />
          </div>

          {/* Beschreibung */}
          <div className="sm:col-span-2 space-y-1">
            <div className="flex items-center">
              <label htmlFor="goal" className="text-white mr-2 font-medium">
                Beschreibung
              </label>
              <Info
                size={16}
                className="cursor-pointer text-white hover:text-teal-300"
                onClick={() => setShowDescInfo(true)}
              />
            </div>
            <textarea
              id="goal"
              name="goal"
              rows={6}
              placeholder="z. B. Ich möchte meine Fitness verbessern…"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-2xl focus:outline-none resize-vertical"
            />
          </div>

          {/* Kategorie */}
          <div className="sm:col-span-2 space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <label className="text-white mr-2 font-medium">Kategorie</label>
                <Info
                  size={16}
                  className="cursor-pointer text-white hover:text-teal-300"
                  onClick={() => setShowCategoryInfo(true)}
                />
              </div>
              <div
                onClick={() => setCustomCategory((c) => !c)}
                className={`flex items-center cursor-pointer select-none ${
                  customCategory ? "text-teal-300" : "text-white"
                }`}
              >
                <span className="mr-2 text-sm">Eigene</span>
                <div
                  className={`w-10 h-6 rounded-full p-1 ${
                    customCategory
                      ? "bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.7)]"
                      : "bg-white/20"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full transform ${
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
          <div className="space-y-1">
            <div className="flex items-center">
              <label className="text-white mr-2 font-medium">
                Schwierigkeitsgrad
              </label>
              <Info
                size={16}
                className="cursor-pointer text-white hover:text-teal-300"
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
              <option value="1">1 – sehr leicht</option>
              <option value="2">2 – leicht</option>
              <option value="3">3 – mittel</option>
              <option value="4">4 – schwer</option>
              <option value="5">5 – extrem</option>
            </select>
          </div>

          {/* Stadt */}
          <div className="space-y-1">
            <div className="flex items-center">
              <label
                htmlFor="city_address"
                className="text-white mr-2 font-medium"
              >
                Stadt
              </label>
              <Info
                size={16}
                className="cursor-pointer text-white hover:text-teal-300"
                onClick={() => setShowCityInfo(true)}
              />
            </div>
            <input
              type="text"
              id="city_address"
              name="city_address"
              placeholder="z. B. Berlin"
              className="w-full p-2 h-11 bg-white/5 border border-white/20 rounded-lg focus:outline-none"
            />
          </div>

          {/* Dauer */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <label className="text-white mr-2 font-medium">Dauer</label>
                <Info
                  size={16}
                  className="cursor-pointer text-white hover:text-teal-300"
                  onClick={() => setShowDurationInfo(true)}
                />
              </div>
              <div
                onClick={() => setDurationEnabled((d) => !d)}
                className={`flex items-center cursor-pointer select-none ${
                  durationEnabled ? "text-teal-300" : "text-white"
                }`}
              >
                <span className="mr-2 text-sm">Eigene</span>
                <div
                  className={`w-10 h-6 rounded-full p-1 ${
                    durationEnabled
                      ? "bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,0.7)]"
                      : "bg-white/20"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full transform ${
                      durationEnabled ? "translate-x-4" : ""
                    }`}
                  />
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
              className="w-full h-11 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Absenden */}
        <button
          disabled={isUploading}
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold shadow-lg hover:brightness-110 transition disabled:opacity-50"
        >
          {isUploading ? "Lädt hoch…" : "Herausforderung erstellen"}
        </button>
      </form>

      {/* GLAS-MODALS */}
      {showNameInfo && (
        <Modal title="Name" onClose={() => setShowNameInfo(false)}>
          Gib deinem Ziel einen prägnanten Namen – kurz und aussagekräftig.
        </Modal>
      )}
      {showCoverInfo && (
        <Modal title="Coverbild" onClose={() => setShowCoverInfo(false)}>
          Lade ein einzelnes Bild hoch. Klick das Vorschaubild, um es zu
          entfernen.
        </Modal>
      )}
      {showDescInfo && (
        <Modal title="Beschreibung" onClose={() => setShowDescInfo(false)}>
          Beschreibe dein Ziel in ein paar Sätzen – je klarer, desto besser.
        </Modal>
      )}
      {showCategoryInfo && (
        <Modal title="Kategorie" onClose={() => setShowCategoryInfo(false)}>
          Wähle eine gängige Kategorie oder aktiviere «Eigene», um frei zu
          definieren.
        </Modal>
      )}
      {showDifficultyInfo && (
        <Modal
          title="Schwierigkeitsgrad"
          onClose={() => setShowDifficultyInfo(false)}
        >
          1 = sehr leicht bis 5 = extrem.
          <br />
          Wähle nach deinem Empfinden – alles ist okay!
        </Modal>
      )}
      {showCityInfo && (
        <Modal title="Stadt" onClose={() => setShowCityInfo(false)}>
          Trage hier den Ort ein, an dem du deinen Fortschritt dokumentierst.
        </Modal>
      )}
      {showDurationInfo && (
        <Modal title="Dauer" onClose={() => setShowDurationInfo(false)}>
          Standardmäßig unbegrenzt. Aktiviere «Eigene», um eine Tagesanzahl
          festzulegen.
        </Modal>
      )}
    </>
  );
}

// Wiederverwendbare Glass-Modal-Komponente
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl max-w-md mx-4 p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold">{title}</h3>
        <div className="text-sm">{children}</div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-teal-400 bg-opacity-60 text-white rounded-lg hover:bg-opacity-80 transition"
        >
          Schließen
        </button>
      </div>
    </div>
  );
}
