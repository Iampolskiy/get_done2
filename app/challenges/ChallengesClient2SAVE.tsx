"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Challenge } from "@/types/types";
/* import { formatGermanDateTime } from "@/lib/date" */
import { useFilter } from "@/app/context/FilterContext";

interface ProgressBarProps {
  createdAt: string | Date;
  duration: number | null;
}
function ProgressBar({ createdAt, duration }: ProgressBarProps) {
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

  const fillColor =
    duration && duration > 0 ? "bg-yellow-400" : "bg-violet-600";

  return (
    <div className="h-2 w-full bg-gray-300">
      <div className={`h-full ${fillColor}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default function ChallengesClient({
  challenges,
}: {
  challenges: Challenge[];
}) {
  const { search, onlyWithImages, sortKeys, sortDescending, viewCols } =
    useFilter();

  // 1) Suche filtern
  const bySearch = useMemo(
    () =>
      challenges.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      ),
    [challenges, search]
  );

  // 2) Optional nur mit Bildern
  const filtered = onlyWithImages
    ? bySearch.filter((c) => (c.images?.length ?? 0) > 0)
    : bySearch;

  // 3) Sortierung
  const sorted = useMemo(() => {
    if (!sortKeys.length) return filtered;
    const key = sortKeys[0];
    return [...filtered].sort((a, b) => {
      let diff = 0;
      switch (key) {
        case "progress":
          diff = (b.progress ?? 0) - (a.progress ?? 0);
          break;
        case "updates":
          diff = (b.updates?.length ?? 0) - (a.updates?.length ?? 0);
          break;
        case "category":
          diff = (a.category ?? "").localeCompare(b.category ?? "");
          break;
        case "date":
          diff =
            new Date(b.created_at!).getTime() -
            new Date(a.created_at!).getTime();
          break;
        case "random":
          diff = Math.random() < 0.5 ? -1 : 1;
          break;
      }
      return sortDescending ? diff : -diff;
    });
  }, [filtered, sortKeys, sortDescending]);

  // 4) Grid-Spalten dynamisch
  const gridColsClass =
    viewCols === 1
      ? "grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  // 5) Card-Größe
  const cardSizeClass =
    viewCols === 1 ? "w-full max-w-md mx-auto h-64" : "w-full aspect-[2/3]";

  // 6) Card-Basis-Stile
  const cardBaseClasses =
    "bg-white/10 backdrop-blur-md border-transparent sm:border sm:border-white/20 " +
    "rounded-2xl overflow-hidden shadow-sm hover:border-teal-300 " +
    "hover:shadow-[0_0_20px_rgba(14,211,181,0.5)] transition";

  return (
    <div className="w-full px-2 sm:px-4 pt-4 overflow-x-hidden">
      <h2
        className="text-4xl sm:text-5xl font-extrabold text-center my-20
                   bg-clip-text text-transparent
                   bg-gradient-to-r from-teal-400 to-indigo-100"
      >
        Ziele
      </h2>

      <div
        className={`grid gap-6 px-4 sm:px-6 lg:px-8 mx-auto pb-10 ${gridColsClass} max-w-screen-2xl`}
      >
        {sorted.length > 0 ? (
          sorted.map((c) => {
            const updates = c.updates?.length ?? 0;
            const imgUrl = c.images?.find((i) => i.isMain)?.url;

            return (
              <Link key={c.id} href={`/challenges/${c.id}`} className="block">
                <div className={`${cardSizeClass} ${cardBaseClasses}`}>
                  {/* Bild-Bereich */}
                  <div className="h-[75%] relative bg-gray-700">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={c.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Kein Bild
                      </div>
                    )}
                  </div>

                  {/* Fortschritts-Bar */}
                  <ProgressBar
                    createdAt={c.created_at!}
                    duration={c.duration ?? null}
                  />

                  {/* Text-Bereich */}
                  <div className="h-[23%] bg-white px-3 py-3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-800 line-clamp-2">
                        {c.goal || "Kein Zieltext hinterlegt."}
                      </p>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-800">
                      <span>
                        {updates} {updates === 1 ? "Update" : "Updates"}
                      </span>
                      <span className="text-gray-500">{c.category || "—"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <p className="col-span-full text-center text-white/70 py-10">
            Keine Ziele gefunden.
          </p>
        )}
      </div>
    </div>
  );
}
