// app/allmychallenges/[id]/MyChallengeClient.tsx
"use client";

import { useState, useMemo } from "react";
import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { deleteChallenge } from "@/actions/challengeActions/deleteChallenge";

type Props = { challenge: Challenge };

export default function MyChallengeClient({ challenge }: Props) {
  /* ------------------ COVER-IMAGE ------------------ */
  const coverImg = useMemo(() => {
    return (challenge.images ?? []).find((i) => i.isMain);
  }, [challenge.images]);

  /* ------------------ UPDATES-MEMO ----------------- */
  const updates = useMemo(() => {
    return challenge.updates ?? [];
  }, [challenge.updates]);

  /* ------------------ ACTIVE-INDEX ---------------- */
  const [activeIdx, setActiveIdx] = useState<number>(() => {
    // Lazy-init: nur beim ersten Render berechnen
    return updates.length > 0 ? updates.length - 1 : 0;
  });

  /* ------------------ ACTIVE-UPDATE ---------------- */
  const activeUpd = useMemo(() => {
    return updates[activeIdx];
  }, [updates, activeIdx]);

  const images = activeUpd?.images ?? [];

  return (
    <section className="bg-slate-50 min-h-screen px-4 md:px-8 py-10">
      {/* ---------- HEADER ------------------------------------------ */}
      <header className="max-w-3xl mx-auto space-y-4">
        {coverImg && (
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-sm">
            <Image
              src={coverImg.url}
              alt={challenge.title}
              fill
              sizes="(max-width:768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {/* Titel, Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{challenge.title}</h1>
            {challenge.goal && (
              <p className="text-gray-600 mt-0.5">{challenge.goal}</p>
            )}
          </div>
          <span
            className={`inline-flex items-center h-8 px-3 rounded-full text-sm font-medium ${
              challenge.completed
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {challenge.completed ? "Abgeschlossen" : "In Bearbeitung"}
          </span>
        </div>

        {/* Fortschritts-Balken */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600"
            style={{ width: `${challenge.progress ?? 0}%` }}
          />
        </div>

        {/* CTA-Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/update/${challenge.id}`}
            className="flex-1 min-w-[140px] bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-center transition"
          >
            Fortschritt eintragen
          </Link>
          <Link
            href={`/edit/${challenge.id}`}
            className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-center transition"
          >
            Challenge bearbeiten
          </Link>
          <form action={deleteChallenge} className="flex-1 min-w-[140px]">
            <input type="hidden" name="id" value={challenge.id} />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
            >
              Challenge löschen
            </button>
          </form>
        </div>
      </header>

      {/* ---------- TIMELINE --------------------------------------- */}
      {updates.length > 0 && (
        <div className="max-w-3xl mx-auto mt-10 space-y-4">
          <h2 className="font-semibold text-lg">Timeline</h2>
          <div className="flex overflow-x-auto gap-3 pb-1">
            {updates.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                           text-sm font-medium transition border
                           ${
                             idx === activeIdx
                               ? "bg-blue-600 text-white border-blue-600 scale-105"
                               : "bg-gray-200 text-gray-800 border-transparent hover:bg-gray-300"
                           }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- AKTUELLES UPDATE ------------------------------- */}
      {activeUpd && (
        <div className="max-w-3xl mx-auto mt-8 bg-white rounded-xl shadow p-4 md:p-6 space-y-6">
          {/* Bilder-Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative w-full aspect-[4/3]">
                  <Image
                    src={img.url}
                    alt="Update Bild"
                    fill
                    sizes="(max-width:768px) 50vw, 200px"
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Datum & Text */}
          <div className="space-y-1">
            <time className="text-sm text-gray-500">
              {new Date(activeUpd.date).toLocaleDateString("de-DE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </time>
            <p className="text-gray-700 leading-relaxed">
              {activeUpd.updateText}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
