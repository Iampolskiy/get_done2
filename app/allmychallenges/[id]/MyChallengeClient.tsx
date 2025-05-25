// app/allmychallenges/[id]/MyChallengeClient.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { deleteChallenge } from "@/actions/challengeActions/deleteChallenge";

type Props = { challenge: Challenge };

// Dynamische Progress-Bar basierend auf created_at und duration
function ProgressBar({
  createdAt,
  duration,
}: {
  createdAt: string | Date;
  duration: number | null;
}) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const createdMs = new Date(createdAt).getTime();
    const nowMs = Date.now();
    const elapsedDays = (nowMs - createdMs) / (1000 * 60 * 60 * 24);

    const totalDays = duration && duration > 0 ? duration : Infinity;
    const ratio =
      totalDays === Infinity
        ? 1
        : Math.min(1, Math.max(0, elapsedDays / totalDays));

    setPercent(ratio * 100);
  }, [createdAt, duration]);

  const fillColor = duration && duration > 0 ? "bg-blue-600" : "bg-violet-600";

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div className={`h-full ${fillColor}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function MyChallengeClient({ challenge }: Props) {
  const coverImg = useMemo(
    () => challenge.images?.find((i) => i.isMain),
    [challenge.images]
  );

  const updates = useMemo(() => challenge.updates ?? [], [challenge.updates]);
  const [activeIdx, setActiveIdx] = useState(updates.length - 1 || 0);
  const activeUpd = updates[activeIdx];
  const updImages = activeUpd?.images ?? [];

  const isInfinite = !challenge.duration || challenge.duration <= 0;

  return (
    <section className="w-full px-4 py-12 bg-gray-900 min-h-screen text-white">
      {/* ---------- HEADER ---------- */}
      <header className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-sm">
        {coverImg && (
          <div className="relative w-full h-64">
            <Image
              src={coverImg.url}
              alt={challenge.title}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Titel */}
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-100">
            {challenge.title}
          </h1>

          {/* Zieltext */}
          {challenge.goal && <p className="text-gray-300">{challenge.goal}</p>}

          {/* Status */}
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              challenge.completed
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            {challenge.completed ? "Abgeschlossen" : "In Bearbeitung"}
          </span>

          {/* Dynamische Progress-Bar */}
          <ProgressBar
            createdAt={challenge.created_at!}
            duration={challenge.duration ?? null}
          />

          {/* Details (ohne numerische Prozent-Anzeige) */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-200">
            <div>
              <strong>Kategorie:</strong> {challenge.category ?? "–"}
            </div>
            <div>
              <strong>Schwierigkeit:</strong> {challenge.difficulty ?? "–"}
            </div>
            <div>
              <strong>Dauer:</strong>{" "}
              {isInfinite ? "Unbegrenzt" : `${challenge.duration} Tage`}
            </div>
            <div>
              <strong>Alter:</strong> {challenge.age ?? "–"}
            </div>
            <div>
              <strong>Geschlecht:</strong> {challenge.gender ?? "–"}
            </div>
            <div className="col-span-2">
              <strong>Ort:</strong> {challenge.city_address ?? "–"}
            </div>
            <div className="col-span-2">
              <strong>Erstellt am:</strong>{" "}
              {new Date(challenge.created_at!).toLocaleDateString("de-DE")}
            </div>
          </div>

          {/* CTA-Buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/update/${challenge.id}`}
              className="flex-1 min-w-[140px] bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg text-center transition"
            >
              Fortschritt eintragen
            </Link>
            <Link
              href={`/edit/${challenge.id}`}
              className="flex-1 min-w-[140px] bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg text-center transition"
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
        </div>
      </header>

      {/* ---------- TIMELINE ---------- */}
      {updates.length > 0 && (
        <div className="max-w-3xl mx-auto mt-10">
          <h2 className="text-lg font-semibold mb-2 text-gray-200">Timeline</h2>
          <div className="flex overflow-x-auto gap-3 pb-2">
            {updates.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                           text-sm font-medium transition ${
                             idx === activeIdx
                               ? "bg-teal-400 text-white"
                               : "bg-white/20 text-gray-200 hover:bg-white/30"
                           }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------- AKTUELLES UPDATE ---------- */}
      {activeUpd && (
        <div className="max-w-3xl mx-auto mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 space-y-4">
            {/* Bilder-Grid */}
            {updImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {updImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative w-full aspect-[4/3] rounded-lg overflow-hidden"
                  >
                    <Image
                      src={img.url}
                      alt="Update Bild"
                      fill
                      sizes="50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <time className="text-sm text-gray-400 block">
              {new Date(activeUpd.createdAt).toLocaleDateString("de-DE", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </time>
            <p className="text-gray-200 leading-relaxed">
              {activeUpd.content || "Kein Update-Text vorhanden."}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <Link
                href={`/editUpdate/${activeUpd.id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition"
              >
                Update bearbeiten
              </Link>
              <Link
                href={`/deleteUpdate/${activeUpd.id}`}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
              >
                Update löschen
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
