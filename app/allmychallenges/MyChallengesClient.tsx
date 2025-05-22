"use client";

import React, { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Challenge } from "@/types/types";
import { formatGermanDateTime } from "@/lib/date";
import { useFilter } from "@/app/context/FilterContext";

export default function MyChallengesClient({
  challenges,
}: {
  challenges: Challenge[];
}) {
  // Toolbar-States aus Context inkl. Sortierung
  const { search, sortKeys, sortDescending, onlyWithImages, viewCols } =
    useFilter();

  // Ref für Scroll-Container
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top on filter/sort change
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [search, onlyWithImages, sortKeys, sortDescending, viewCols]);

  // Filter by search & image presence
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

  // Sortierung auf Basis der ersten gewählten Key und Richtung
  const sorted = useMemo(() => {
    if (sortKeys.length === 0) return filtered;
    const key = sortKeys[0];
    const arr = [...filtered].sort((a, b) => {
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
      return diff !== 0 ? diff : 0;
    });
    return sortDescending ? arr : arr.reverse();
  }, [filtered, sortKeys, sortDescending]);

  // Grid-Klassen
  const gridColsClass =
    viewCols === 1
      ? "max-w-[780px] mx-auto grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

  const cardClasses =
    "relative flex flex-col overflow-hidden rounded-2xl " +
    "bg-white/10 backdrop-blur-md border-transparent sm:border sm:border-white/20 " +
    "snap-start shadow-sm hover:border-teal-300 hover:shadow-[0_0_20px_rgba(14,211,181,0.5)] transition";

  return (
    <div className="w-full px-2 sm:px-4 pt-4 overflow-x-hidden">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center my-20 bg-gradient-to-r from-teal-400 to-indigo-100 bg-clip-text text-transparent">
        Meine Ziele
      </h2>

      {/* Challenges Grid */}
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
                className={cardClasses}
              >
                {/* Image */}
                <div className="relative h-56 w-full bg-gray-800">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={c.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/50">
                      Kein Bild
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow p-5 flex flex-col justify-between">
                  <h3 className="text-lg font-bold text-white line-clamp-2">
                    {c.title}
                  </h3>
                  <div className="mt-2 text-sm text-white/60">
                    Erstellt: {formatGermanDateTime(c.created_at)}
                  </div>
                  <p className="mt-1 text-sm text-white/70 line-clamp-3">
                    {c.goal || "Kein Zieltext hinterlegt."}
                  </p>
                  <div className="mt-3 text-sm text-white/60 space-y-1">
                    <div>Kategorie: {c.category || "—"}</div>
                    <div>
                      {updates} {updates === 1 ? "Update" : "Updates"}
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
