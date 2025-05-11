// app/edit/[id]/EditClient.tsx
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { editChallenge } from "@/actions/challengeActions/editChallenge";
import type { Challenge } from "@/types/types";

/* ---------- Reusable Input-Field ------------------------- */
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
  const ph = value || value === 0 ? `Aktuell: ${value}` : "Noch leer";

  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={value ?? ""}
        placeholder={ph}
        className="w-full rounded border p-2 placeholder-gray-400/60"
        {...(type === "number" && { min: 0 })}
      />
    </label>
  );
}

/* ---------- Haupt-Komponente ----------------------------- */
export default function EditClient({ challenge }: { challenge: Challenge }) {
  /* Titelbilder (nur isMain =true) */
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const fileInp = useRef<HTMLInputElement>(null);

  /* Initiale Bilder einmalig übernehmen */
  useEffect(() => {
    setImages(
      challenge.images?.filter((i) => i.isMain).map((i) => i.url) ?? []
    );
  }, [challenge]);

  /* Bild entfernen */
  const remove = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  /* Upload-Handler */
  const upload = async (files: FileList | null) => {
    if (!files) return;
    const free = 10 - images.length;
    if (free <= 0) {
      alert("Maximal 10 Titelbilder erlaubt.");
      return;
    }
    setBusy(true);
    const urls: string[] = [];

    for (const file of Array.from(files).slice(0, free)) {
      const body = new FormData();
      body.set("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body });
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        const url = json.url ?? json.secure_url;
        if (url) urls.push(url);
      } catch (e) {
        console.error("Upload fehlgeschlagen:", e);
      }
    }

    setImages((p) => [...p, ...urls]);
    setBusy(false);
    if (fileInp.current) fileInp.current.value = "";
  };

  /* Form-Submit */
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await editChallenge(fd, images);
  };

  /* ---------- Render -------------------------------------- */
  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-lg space-y-6 rounded bg-white p-6 shadow"
    >
      <h2 className="text-2xl font-bold">Challenge bearbeiten</h2>

      {/* Bild-Vorschau */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {images.map((u, i) => (
            <div key={u + i} className="relative">
              <Image
                src={u}
                alt=""
                width={130}
                height={130}
                className="cursor-pointer rounded"
                onClick={() => remove(i)}
              />
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                ✕
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Upload-Input */}
      <label className="block space-y-1">
        <span className="text-sm font-medium text-gray-700">
          {busy ? "Hochladen …" : "Titelbild(er) auswählen (max 10)"}
        </span>
        <input
          ref={fileInp}
          type="file"
          accept="image/*"
          multiple
          disabled={busy}
          onChange={(e) => upload(e.target.files)}
          className="w-full rounded border p-2"
        />
      </label>

      {/* Hidden ID */}
      <input type="hidden" name="id" defaultValue={challenge.id} />

      {/* Edit-Felder */}
      <Field label="Title" name="title" value={challenge.title} />
      <Field label="Category" name="category" value={challenge.category} />
      <Field
        label="Difficulty"
        name="difficulty"
        value={challenge.difficulty}
      />
      <Field
        label="Description"
        name="description"
        value={challenge.description}
      />
      <Field
        label="Duration (d)"
        name="duration"
        type="number"
        value={challenge.duration}
      />
      <Field
        label="Progress (%)"
        name="progress"
        type="number"
        value={challenge.progress}
      />
      <Field label="Age" name="age" type="number" value={challenge.age} />
      <Field label="Gender" name="gender" value={challenge.gender} />
      <Field
        label="City Address"
        name="city_address"
        value={challenge.city_address}
      />
      <Field label="Goal" name="goal" value={challenge.goal} />

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:bg-blue-400"
      >
        {busy ? "Speichern …" : "Speichern"}
      </button>
    </form>
  );
}
