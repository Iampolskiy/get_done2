// app/challenges/ChallengesClient.tsx
"use client";

import React, { useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Challenge } from "@/types/types";
import { useFilter } from "@/app/context/FilterContext";

/**
 * Helper: formatiert Datum+Uhrzeit stets in de-DE, verhindert Hydration-Fehler
 */
function formatGermanDateTime(iso?: string | Date | null): string {
  if (!iso) return "—";
  const d = iso instanceof Date ? iso : new Date(iso);
  const date = d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return `${date}, ${time}`;
}

interface ChallengesClientProps {
  challenges: Challenge[];
}

export default function ChallengesClient({
  challenges,
}: ChallengesClientProps) {
  // State jetzt aus FilterContext
  const { search, sortKeys, onlyWithImages, viewCols } = useFilter();

  // Refs & Hilfen
  const containerRef = useRef<HTMLDivElement>(null);
  /* const priorityColors = ["text-teal-300", "text-teal-200", "text-teal-100"]; */

  // Scroll to top when sort changes
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [sortKeys]);

  // Filter by search
  const bySearch = useMemo(() => {
    return challenges.filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [challenges, search]);

  // Filter by image presence
  const filtered = onlyWithImages
    ? bySearch.filter((c) => (c.images?.length ?? 0) > 0)
    : bySearch;

  // Multi-key sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      for (const key of sortKeys) {
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
        if (diff !== 0) return diff;
      }
      return 0;
    });
  }, [filtered, sortKeys]);

  // Grid layout classes
  const gridColsClass =
    viewCols === 1
      ? "max-w-[780px] mx-auto grid-cols-1"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

  // Card base classes
  const cardClasses =
    "relative flex flex-col overflow-hidden rounded-2xl " +
    "bg-white/10 backdrop-blur-md border-transparent sm:border sm:border-white/20 " +
    "snap-start shadow-sm hover:border-teal-300 hover:shadow-[0_0_20px_rgba(14,211,181,0.5)] transition";

  return (
    <div className="w-full px-2 sm:px-4 pt-4 overflow-x-hidden">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-10 bg-gradient-to-r from-teal-400 to-indigo-100 bg-clip-text text-transparent">
        Entdecke mehr Ziele
      </h2>

      {/* Grid mit gefilterten & sortierten Challenges */}
      <div
        className={`grid ${gridColsClass} gap-6 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto pb-10`}
      >
        {sorted.map((c) => {
          const updates = c.updates?.length ?? 0;
          const imgUrl = c.images?.find((i) => i.isMain)?.url;
          return (
            <Link
              key={c.id}
              href={`/challenges/${c.id}`}
              className={cardClasses}
            >
              <div className="relative h-72 w-full bg-gray-800">
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

              <div className="absolute top-4 right-4 z-10 w-12 h-12">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <defs>
                    <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14B8A6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    strokeWidth="10"
                    fill="none"
                    className="stroke-white/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    strokeWidth="10"
                    fill="none"
                    stroke="url(#grad)"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={
                      (2 * Math.PI * 45 * (100 - (c.progress ?? 0))) / 100
                    }
                    transform="rotate(-90 50 50)"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  <text
                    x="50"
                    y="54"
                    textAnchor="middle"
                    className="text-xl font-bold text-white"
                  >
                    {Math.round(c.progress ?? 0)}%
                  </text>
                </svg>
              </div>

              <div className="flex-grow p-5 flex flex-col justify-between">
                <h2 className="text-xl font-bold text-white line-clamp-2">
                  {c.title}
                </h2>
                {c.author && (
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-sm text-white/70">
                      {c.author.name}
                    </span>
                  </div>
                )}
                <div className="mt-2 text-sm text-white/60">
                  Created: {formatGermanDateTime(c.created_at)}
                </div>
                <div className="mt-2 text-sm text-white/60">
                  Dauer: {c.duration}
                </div>
                <p className="mt-1 text-sm text-white/70 line-clamp-3">
                  {c.goal || "Kein Zieltext hinterlegt."}
                </p>
                <div className="mt-2 text-sm text-white/60 space-y-1">
                  <div>Address: {c.city_address || ""}</div>
                  <div>Category: {c.category || ""}</div>
                  <div>
                    {updates} {updates === 1 ? "Update" : "Updates"}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
