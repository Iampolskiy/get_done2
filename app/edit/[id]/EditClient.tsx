// app/edit/[id]/EditClient.tsx
"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { editChallenge } from "@/actions/challengeActions/editChallenge";
import type { Challenge } from "@/types/types";

const COMMON_CATEGORIES = [
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

// Wiederverwendbares Input-Feld
function Field({
  label,
  name,
  value,
  type = "text",
}: {
  label: string;
  name: string;
  value: string | number | null | undefined;
  type?: "text" | "number";
}) {
  const placeholder =
    value !== undefined && value !== null && value !== ""
      ? `Aktuell: ${value}`
      : "";
  return (
    <label className="block space-y-1 sm:col-span-2">
      <span className="text-white font-medium">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={value ?? ""}
        placeholder={placeholder}
        {...(type === "number" && { min: 0 })}
        className="w-full h-12 p-3 bg-white/5 border border-white/20 rounded-lg
                   focus:outline-none text-white placeholder-white/50 read-only:opacity-50"
      />
    </label>
  );
}

export default function EditClient({ challenge }: { challenge: Challenge }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  // Refs für File-Upload und Duration
  const fileInp = useRef<HTMLInputElement>(null);
  const durationRef = useRef<HTMLInputElement>(null);

  // Kategorie-Modus: eigen oder Auswahl
  const [customCategory, setCustomCategory] = useState<boolean>(() => {
    // Custom, wenn challenge.category nicht in COMMON_CATEGORIES oder leer
    return (
      !challenge.category || !COMMON_CATEGORIES.includes(challenge.category)
    );
  });

  // Dauer-Modus im Edit (Eigen = Dauer > 0)
  const [durationEnabled, setDurationEnabled] = useState<boolean>(
    (challenge.duration ?? 0) > 0
  );

  // Initial Coverbilder übernehmen
  useEffect(() => {
    setImages(
      challenge.images?.filter((i) => i.isMain).map((i) => i.url) ?? []
    );
  }, [challenge.images]);

  // Bild entfernen
  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  // Upload-Handler (max. 1 Coverbild)
  const upload = async (files: FileList | null) => {
    if (!files) return;
    const free = 1 - images.length;
    if (free <= 0) {
      alert("Maximal 1 Coverbild erlaubt.");
      return;
    }
    setBusy(true);
    const urls: string[] = [];
    for (const file of Array.from(files).slice(0, free)) {
      const data = new FormData();
      data.set("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: data });
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        const url = json.url ?? json.secure_url;
        if (url) urls.push(url);
      } catch {
        console.error("Upload fehlgeschlagen");
      }
    }
    setImages((p) => [...p, ...urls]);
    setBusy(false);
    if (fileInp.current) fileInp.current.value = "";
  };

  // Dauer-Switch umschalten
  const toggleDuration = () => {
    const next = !durationEnabled;
    setDurationEnabled(next);
    if (durationRef.current) {
      // Wenn unendlich: setze "0", sonst leere Eingabe
      durationRef.current.value = next ? "" : "0";
    }
  };

  // Formular-Submit
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    // Wenn customCategory gewählt, clear Select
    if (customCategory) {
      const sel = e.currentTarget.querySelector<HTMLSelectElement>("#category");
      if (sel) sel.value = "";
    }

    const fd = new FormData(e.currentTarget);
    await editChallenge(fd, images);

    router.refresh();
    setBusy(false);
  };

  // InitialCategory immer als string (nie null/undefined)
  const initialCategory: string = COMMON_CATEGORIES.includes(
    challenge.category ?? ""
  )
    ? challenge.category!
    : "";

  return (
    <form
      onSubmit={submit}
      className="max-w-3xl mx-auto mt-10 p-6 pt-20 mb-20 pb-10
                 bg-white/10 backdrop-blur-md border border-white/20
                 rounded-2xl shadow-sm space-y-10"
    >
      {/* Überschrift */}
      <h2
        className="text-4xl sm:text-5xl font-extrabold text-center
                   bg-clip-text text-transparent
                   bg-gradient-to-r from-teal-400 to-indigo-500"
      >
        Challenge bearbeiten
      </h2>

      {/* Cover-Preview */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {images.map((url, i) => (
            <div
              key={i}
              className="relative h-64 w-64 rounded-lg overflow-hidden
                         border-2 border-transparent hover:border-red-500
                         transition cursor-pointer"
              onClick={() => !busy && removeImage(i)}
            >
              <Image
                src={url}
                alt={`Cover ${i + 1}`}
                fill
                className="object-cover"
              />
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                ✕
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Cover-Upload */}
      <div className="space-y-1">
        <button
          type="button"
          disabled={busy}
          onClick={() => fileInp.current?.click()}
          className={`flex items-center font-bold text-transparent
                     bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-500
                     mr-2 transition-transform ${
                       busy
                         ? "opacity-50 cursor-not-allowed"
                         : "hover:brightness-125 hover:scale-105"
                     }`}
        >
          <File size={20} className="mr-2 text-white" />
          Bild auswählen
        </button>
        <input
          ref={fileInp}
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => upload(e.currentTarget.files)}
          className="hidden"
        />
      </div>

      {/* Formularfelder */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Titel */}
        <Field label="Titel" name="title" value={challenge.title} />

        {/* Beschreibung */}
        <label className="block space-y-1 sm:col-span-2">
          <span className="text-white font-medium">Beschreibung</span>
          <textarea
            name="description"
            defaultValue={challenge.description ?? ""}
            placeholder={
              challenge.description ? `Aktuell: ${challenge.description}` : ""
            }
            rows={5}
            className="w-full p-3 bg-white/5 border border-white/20
                       rounded-2xl focus:outline-none resize-vertical
                       text-white placeholder-white/50"
          />
        </label>

        {/* Kategorie mit Toggle */}
        <div className="sm:col-span-2 space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Kategorie</span>
            <button
              type="button"
              onClick={() => setCustomCategory((c) => !c)}
              className={`flex items-center cursor-pointer select-none ${
                customCategory ? "text-teal-300" : "text-white"
              }`}
            >
              <span className="mr-2 text-sm">Eigen</span>
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
            </button>
          </div>
          {customCategory ? (
            <input
              type="text"
              id="category"
              name="category"
              defaultValue={challenge.category ?? ""}
              placeholder={
                challenge.category ? `Aktuell: ${challenge.category}` : ""
              }
              className="w-full h-12 p-3 bg-white/5 border border-white/20
                         rounded-lg focus:outline-none text-white placeholder-white/50"
            />
          ) : (
            <select
              id="category"
              name="category"
              defaultValue={initialCategory}
              className="w-full h-12 p-3 bg-white/5 border border-white/20
                         rounded-lg focus:outline-none text-white"
            >
              <option value="">Bitte wählen…</option>
              {COMMON_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Schwierigkeitsgrad */}
        <Field
          label="Schwierigkeitsgrad"
          name="difficulty"
          value={challenge.difficulty}
        />

        {/* Stadt */}
        <Field
          label="Stadt"
          name="city_address"
          value={challenge.city_address}
        />

        {/* Dauer mit Toggle */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Dauer (Tage)</span>
            <button
              type="button"
              onClick={toggleDuration}
              className={`flex items-center cursor-pointer select-none ${
                durationEnabled ? "text-teal-300" : "text-white"
              }`}
            >
              <span className="mr-2 text-sm">Eigen</span>
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
            </button>
          </div>
          <input
            ref={durationRef}
            type="number"
            id="duration"
            name="duration"
            min="1"
            defaultValue={
              (challenge.duration ?? 0) > 0
                ? challenge.duration?.toString()
                : ""
            }
            readOnly={!durationEnabled}
            placeholder={durationEnabled ? "" : "unbegrenzt"}
            className="w-full h-12 p-3 bg-white/5 border border-white/20
                       rounded-lg focus:outline-none text-white placeholder-white/50"
          />
        </div>

        {/* Ziel */}
        <Field label="Ziel" name="goal" value={challenge.goal} />

        <input type="hidden" name="id" defaultValue={challenge.id} />
      </div>

      {/* Absenden */}
      <button
        type="submit"
        disabled={busy}
        className="w-full py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-semibold shadow-lg hover:brightness-110 transition disabled:opacity-50"
      >
        {busy ? "Speichern …" : "Speichern"}
      </button>
    </form>
  );
}
