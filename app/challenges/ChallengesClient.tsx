// file: app/challenges/ChallengesClient.tsx
"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Sliders, Search, Camera } from "lucide-react";

type ChallengesClientProps = {
  challenges: Challenge[];
};

export default function ChallengesClient({
  challenges,
}: ChallengesClientProps) {
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [onlyWithImages, setOnlyWithImages] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState<
    "progress" | "updates" | "category" | "date" | "random"
  >("progress");
  const [viewCols, setViewCols] = useState<1 | 2>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [sortKey]);

  const bySearch = useMemo(
    () =>
      challenges.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase())
      ),
    [challenges, query]
  );

  const filtered = onlyWithImages
    ? bySearch.filter((c) => (c.images?.length ?? 0) > 0)
    : bySearch;

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortKey) {
      case "progress":
        return arr.sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0));
      case "updates":
        return arr.sort(
          (a, b) => (b.updates?.length ?? 0) - (a.updates?.length ?? 0)
        );
      case "category":
        return arr.sort((a, b) =>
          (a.category ?? "").localeCompare(b.category ?? "")
        );
      case "date":
        return arr.sort(
          (a, b) =>
            new Date(b.created_at?.toString() ?? "").getTime() -
            new Date(a.created_at?.toString() ?? "").getTime()
        );
      case "random":
        return arr.sort(() => 0.5 - Math.random());
      default:
        return arr;
    }
  }, [filtered, sortKey]);

  const gridCols =
    viewCols === 1 ? "sm:grid-cols-1 justify-items-center" : "sm:grid-cols-2";
  const gapClasses = viewCols === 2 ? "gap-6 sm:gap-4" : "gap-6";
  const cardWidthClasses =
    viewCols === 1
      ? "w-full max-w-[96vw] sm:w-[30vw] min-w-[300px]"
      : "w-full ";
  const cardHeightClass = "h-[calc(100vh-12rem)]";

  return (
    <div className="w-full px-2 sm:px-4 pt-4">
      <div
        className={`
          sticky top-0 z-20 backdrop-blur-md bg-black/40 justify-center
          ${cardWidthClasses} mx-auto
          py-3 flex flex-wrap items-center gap-4
        `}
      >
        {/* Search Icon */}
        <button
          onClick={() => setShowSearch((v) => !v)}
          className="text-white p-2 rounded-full hover:bg-white/10 transition"
        >
          <Search size={20} />
        </button>

        {/* Show Search Input if visible */}
        {showSearch && (
          <div className="relative w-full sm:w-auto flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full rounded-full bg-white/10 placeholder-white/50 text-white px-4 py-2 pl-10 focus:outline-none"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
              🔍
            </span>
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center space-x-1 text-white transition"
          >
            <Sliders size={20} />
            {/* <span className="text-sm">Sort: {sortKey}</span> */}
            <ChevronDown
              size={16}
              className={`${sortOpen ? "rotate-180" : ""} transition`}
            />
          </button>
          {sortOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-black/80 text-white rounded-md shadow-lg overflow-hidden">
              {(
                ["progress", "updates", "category", "date", "random"] as const
              ).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setSortKey(key);
                    setSortOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 transition ${
                    sortKey === key ? "font-bold" : ""
                  }`}
                >
                  {key === "random"
                    ? "Zufällig"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nur mit Bildern Icon */}
        <button
          onClick={() => setOnlyWithImages((v) => !v)}
          className="text-white p-2 rounded-full hover:bg-white/10 transition"
          title="Nur mit Bildern"
        >
          <Camera
            size={20}
            className={`transition ${
              onlyWithImages ? "text-teal-300" : "text-white/40"
            }`}
          />
        </button>

        {/* View Toggle */}
        <div className="hidden sm:flex items-center">
          <button
            onClick={() => setViewCols(viewCols === 1 ? 2 : 1)}
            className="flex items-center space-x-1 p-2 rounded transition"
          >
            {[1, 2].map((i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= viewCols ? "bg-teal-300" : "bg-white/30"
                }`}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div
        ref={containerRef}
        className="mt-2 overflow-y-auto snap-y snap-mandatory max-h-[calc(100vh-6rem)]"
      >
        <div className={`grid ${gapClasses} pb-8 grid-cols-1 ${gridCols}`}>
          {sorted.map((c) => {
            const pct = Math.round(c.progress ?? 0);
            const updates = c.updates?.length ?? 0;
            const imgUrl =
              c.images?.find((i) => i.isMain)?.url ||
              `https://source.unsplash.com/random/800x600?sig=${c.id}`;

            return (
              <Link
                key={c.id}
                href={`/allmychallenges/${c.id}`}
                className="snap-start"
              >
                <div
                  className={`
                    relative flex flex-col overflow-hidden
                    rounded-2xl bg-white/10 backdrop-blur-md
                    ${cardWidthClasses} ${cardHeightClass}
                    border-transparent sm:border sm:border-white/20
                  `}
                >
                  <div className="relative h-72 w-full">
                    <Image
                      src={imgUrl}
                      alt={c.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <svg width={44} height={44} viewBox="0 0 44 44">
                      <circle
                        cx="22"
                        cy="22"
                        r={18}
                        strokeWidth={4}
                        className="fill-none stroke-white/25"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        r={18}
                        strokeWidth={4}
                        strokeDasharray={2 * Math.PI * 18}
                        strokeDashoffset={
                          (2 * Math.PI * 18 * (100 - pct)) / 100
                        }
                        transform="rotate(-90 22 22)"
                        strokeLinecap="round"
                        className="fill-none stroke-teal-400"
                      />
                    </svg>
                  </div>

                  <div className="flex-grow p-5 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white line-clamp-2">
                        {c.title}
                      </h2>
                      <p className="mt-1 text-sm text-white/70 line-clamp-3">
                        {c.goal || "Kein Zieltext hinterlegt."}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-white/60 space-y-1">
                      <div>Address: {c.city_address || "—"}</div>
                      <div>
                        Created:{" "}
                        {new Date(c.created_at || "").toLocaleDateString(
                          "de-DE"
                        )}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-white/60 space-y-1">
                      <div>Category: {c.category || "—"}</div>
                      <div>
                        {updates} {updates === 1 ? "Update" : "Updates"}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {sorted.length === 0 && (
            <p className="col-span-full text-center text-white/50 py-10">
              Keine Challenges gefunden.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
