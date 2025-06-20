// app/create/CreateClient.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Info, File } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createChallenge,
  UploadedImage,
} from "@/actions/challengeActions/createChallenge";

interface CreateClientProps {
  countryList: string[];
}

export default function CreateClient({ countryList }: CreateClientProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setUploading] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Ausgewähltes Land (Dropdown-Select)
  const [country, setCountry] = useState("");

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

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleUpload(files: FileList | null) {
    if (!files || isUploading) return;
    if (slotsLeft <= 0) {
      alert("Maximal 1 Coverbild erlaubt.");
      return;
    }
    setUploading(true);
    const uploaded: UploadedImage[] = [];
    for (const file of Array.from(files).slice(0, slotsLeft)) {
      const data = new FormData();
      data.set("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isUploading || isSubmitting) return;

    // Validierung: Land ausgewählt?
    if (!country) {
      alert("Bitte wähle ein Land aus der Dropdown-Liste.");
      return;
    }

    const form = e.currentTarget as HTMLFormElement;
    // Dauer-Fallback
    if (!durationEnabled) {
      form.querySelector<HTMLInputElement>("#duration")!.value = "0";
    }
    // Eigene Kategorie deaktivieren
    if (customCategory) {
      form.querySelector<HTMLSelectElement>("#category")!.value = "";
    }

    setSubmitting(true);

    // Server-Action aufrufen und danach clientseitig navigieren
    const fd = new FormData(form);
    fd.set("country", country);
    try {
      await createChallenge(images, fd);
      router.push("/allmychallenges?success=true");
    } catch (err) {
      console.error("Fehler beim Erstellen der Challenge:", err);
      alert("Beim Erstellen der Challenge ist ein Fehler aufgetreten.");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleDuration() {
    const next = !durationEnabled;
    setDurationEnabled(next);
    if (!next) {
      durationRef.current!.value = "";
    }
  }

  return (
    <>
      <style jsx global>{`
        input[type="file"]::-webkit-file-upload-text,
        input[type="file"]::-moz-file-upload-text {
          display: none;
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mt-10 mx-auto p-6 pt-20 mb-20 pb-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm space-y-10"
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
              onClick={() => !isUploading && !isSubmitting && removeImage(idx)}
              className="relative h-64 w-64 mx-auto rounded-lg overflow-hidden border-2 border-transparent hover:border-red-500 transition group cursor-pointer"
            >
              <Image
                src={img.url}
                alt={`Cover ${idx + 1}`}
                fill
                className="object-cover p-6 filter transition group-hover:grayscale"
              />
            </div>
          ))}
        </div>

        {/* Cover-Upload */}
        <div className="sm:col-span-2 space-y-1">
          <div className="flex items-center">
            <button
              type="button"
              disabled={isUploading || slotsLeft <= 0 || isSubmitting}
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500 mr-2 transition-transform ${
                isUploading || slotsLeft <= 0 || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:brightness-125 hover:scale-105"
              }`}
            >
              <File size={20} className="mr-2 text-white" />
              Bild auswählen
            </button>
            <Info
              size={16}
              className="cursor-pointer text-white ml-1 hover:text-teal-300"
              onClick={() => setShowCoverInfo(true)}
            />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            disabled={isUploading || slotsLeft <= 0 || isSubmitting}
            className="hidden"
            onChange={(e) => handleUpload(e.currentTarget.files)}
            accept="image/*"
          />
        </div>

        {/* Restliche Eingabefelder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Titel */}
          <div className="sm:col-span-2 space-y-1">
            <div className="flex items-center">
              <label htmlFor="title" className="text-white mr-2 font-medium">
                Titel
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
              disabled={isUploading || isSubmitting}
              placeholder="z. B. 100 Tage ohne Zucker"
              className="w-full h-12 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
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
              disabled={isUploading || isSubmitting}
              placeholder="z. B. Ich möchte meine Fitness verbessern…"
              className="w-full p-3 bg-white/5 border border-white/20 rounded-2xl focus:outline-none resize-vertical disabled:opacity-50"
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
                required
                disabled={isUploading || isSubmitting}
                placeholder="Eigene Kategorie eingeben…"
                className="w-full h-12 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
              />
            ) : (
              <select
                id="category"
                name="category"
                required
                disabled={isUploading || isSubmitting}
                className="w-full h-12 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
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
              disabled={isUploading || isSubmitting}
              className="w-full h-12 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
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
              disabled={isUploading || isSubmitting}
              placeholder="z. B. Berlin"
              className="w-full h-12 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
            />
          </div>

          {/* Land */}
          <div className="space-y-1">
            <div className="flex items-center">
              <label htmlFor="country" className="text-white mr-2 font-medium">
                Land
              </label>
              <Info
                size={16}
                className="cursor-pointer text-white hover:text-teal-300"
                onClick={() => alert("Bitte wähle ein Land aus der Liste.")}
              />
            </div>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled={isUploading || isSubmitting}
              className="w-full h-12 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
            >
              <option value="">Bitte Land auswählen…</option>
              {countryList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
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
                onClick={toggleDuration}
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
              ref={durationRef}
              type="number"
              id="duration"
              name="duration"
              min="1"
              disabled={!durationEnabled || isUploading || isSubmitting}
              placeholder={durationEnabled ? "z. B. 30" : "unendlich"}
              className="w-full h-12 p-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        {/* Absenden */}
        <button
          disabled={isUploading || isSubmitting}
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold shadow-lg hover:brightness-110 transition disabled:opacity-50"
        >
          {isSubmitting
            ? "Wird erstellt…"
            : isUploading
            ? "Lädt hoch…"
            : "Herausforderung erstellen"}
        </button>
      </form>

      {/* Gläserne Modals */}
      {showNameInfo && (
        <Modal title="Titel" onClose={() => setShowNameInfo(false)}>
          Gib deinem Ziel einen prägnanten Titel – kurz und aussagekräftig.
        </Modal>
      )}
      {showCoverInfo && (
        <Modal title="Coverbild" onClose={() => setShowCoverInfo(false)}>
          Lade ein einzelnes Bild hoch. Klicke auf die Vorschau, um es zu
          entfernen.
        </Modal>
      )}
      {showDescInfo && (
        <Modal title="Beschreibung" onClose={() => setShowDescInfo(false)}>
          Beschreibe dein Ziel in wenigen Sätzen – je klarer, desto leichter zu
          starten.
        </Modal>
      )}
      {showCategoryInfo && (
        <Modal title="Kategorie" onClose={() => setShowCategoryInfo(false)}>
          Wähle aus den Vorschlägen oder aktiviere „Eigene“, um frei zu
          definieren.
        </Modal>
      )}
      {showDifficultyInfo && (
        <Modal
          title="Schwierigkeitsgrad"
          onClose={() => setShowDifficultyInfo(false)}
        >
          1 = sehr leicht bis 5 = extrem. Wähle nach deinem Empfinden.
        </Modal>
      )}
      {showCityInfo && (
        <Modal title="Stadt" onClose={() => setShowCityInfo(false)}>
          Trage hier den Ort ein, an dem du dein Ziel verfolgst.
        </Modal>
      )}
      {showDurationInfo && (
        <Modal title="Dauer" onClose={() => setShowDurationInfo(false)}>
          Standardmäßig unbegrenzt. Aktiviere „Eigene“, um eine Tagesanzahl zu
          setzen.
        </Modal>
      )}
    </>
  );
}

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
