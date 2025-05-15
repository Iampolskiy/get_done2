// app/editUpdate/[id]/EditUpdateClient.tsx
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import { Update } from "@/types/types";
import { editUpdate } from "@/actions/challengeActions/editUpdate";

export default function EditUpdateClient({ update }: { update: Update }) {
  const [updateText, setUpdateText] = useState(update.content || "");
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const fileInp = useRef<HTMLInputElement>(null);

  // Initiale Bilder übernehmen
  useEffect(() => {
    setImages(update.images?.map((img) => img.url) ?? []);
  }, [update]);

  const remove = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const upload = async (files: FileList | null) => {
    if (!files) return;
    const free = 10 - images.length;
    if (free <= 0) {
      alert("Maximal 10 Bilder erlaubt.");
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
        urls.push(json.url);
      } catch (e) {
        console.error("Upload fehlgeschlagen:", e);
      }
    }

    setImages((prev) => [...prev, ...urls]);
    setBusy(false);
    if (fileInp.current) fileInp.current.value = "";
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await editUpdate(fd, images);
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-lg space-y-6 rounded bg-white p-6 shadow"
    >
      <h2 className="text-2xl font-bold">Update bearbeiten</h2>

      <textarea
        name="updateText"
        value={updateText}
        onChange={(e) => setUpdateText(e.target.value)}
        className="w-full rounded border p-2"
        placeholder="Update-Text"
        required
      />

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

      <label className="block space-y-1">
        <span className="text-sm font-medium text-gray-700">
          {busy ? "Hochladen …" : "Bild(er) auswählen (max 10)"}
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

      <input type="hidden" name="updateId" value={update.id} />

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400"
      >
        {busy ? "Speichern …" : "Speichern"}
      </button>
    </form>
  );
}
