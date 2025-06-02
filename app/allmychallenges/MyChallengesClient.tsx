"use client";

import React, { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Challenge } from "@/types/types";
import { formatGermanDateTime } from "@/lib/date";
import { useFilter } from "@/app/context/FilterContext";
/* import { GlobeWithSearch } from "@/components/GlobeWithSearch"; */

export default function MyChallengesClient({
  challenges,
}: {
  challenges: Challenge[];
}) {
  const { search, sortKeys, sortDescending, onlyWithImages, viewCols } =
    useFilter();

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [search, onlyWithImages, sortKeys, sortDescending, viewCols]);

  const bySearch = useMemo(
    () =>
      challenges.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      ),
    [challenges, search]
  );
  const filtered = onlyWithImages
    ? bySearch.filter((c) => (c.images?.length ?? 0) > 0)
    : bySearch;
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
            new Date(b.created_at ?? "").getTime() -
            new Date(a.created_at ?? "").getTime();
          break;
        case "random":
          diff = Math.random() < 0.5 ? -1 : 1;
          break;
      }
      return sortDescending ? diff : -diff;
    });
  }, [filtered, sortKeys, sortDescending]);

  // --- NEU: dynamische Spalten ---
  const gridColsClass =
    viewCols === 1
      ? "grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

  // --- NEU: Card-Größe wie in ChallengesClient ---
  const cardSizeClass =
    viewCols === 1 ? "w-full max-w-md mx-auto h-[70vh]" : "w-full aspect-[2/3]";

  // bestehende Card-Stile mit Hover aus MyChallengesClient
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
        Meine Ziele
      </h2>
      {/* <GlobeWithSearch /> */}

      <div
        ref={containerRef}
        className={`grid gap-6 px-4 sm:px-6 lg:px-8 mx-auto pb-10 ${gridColsClass} max-w-screen-2xl`}
      >
        {sorted.length > 0 ? (
          sorted.map((c) => {
            const updates = c.updates?.length ?? 0;
            const imgUrl = c.images?.find((i) => i.isMain)?.url;
            return (
              <Link
                key={c.id}
                href={`/allmychallenges/${c.id}`}
                className="block"
              >
                <div className={`${cardSizeClass} ${cardBaseClasses}`}>
                  {/* Bild 60% */}
                  <div className="h-[60%] bg-gray-700 relative">
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
                  {/* Text 40% */}
                  <div className="h-[40%] bg-white p-5 flex flex-col justify-between">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {c.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      Erstellt: {formatGermanDateTime(c.created_at)}
                    </p>
                    <p className="mt-1 text-sm text-gray-700 line-clamp-2">
                      {c.goal || "Kein Zieltext hinterlegt."}
                    </p>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>
                        {updates} {updates === 1 ? "Update" : "Updates"}
                      </span>
                      <span>{c.category || "—"}</span>
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
