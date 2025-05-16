"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Sliders } from "lucide-react";

type ChallengesClientProps = {
  challenges: Challenge[];
};

export default function ChallengesClient({
  challenges,
}: ChallengesClientProps) {
  const [query, setQuery] = useState("");
  const [onlyWithImages, setOnlyWithImages] = useState(true);

  const [sortOpen, setSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState<
    "progress" | "updates" | "category" | "date" | "random"
  >("progress");

  // 1- vs. 2-Spalten-Modus
  const [viewCols, setViewCols] = useState<1 | 2>(1);

  // Referenz zum Scroll-Container, um bei Sort-Wechsel nach oben zu scrollen
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [sortKey]);

  // Suche + Filter
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

  // Sortierung inkl. Datum & Zufall
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

  // Card-Dimensionen
  const cardHeight = "calc(100vh - 12rem)"; // fast volle Höhe
  const cardWidth = viewCols === 1 ? "28vw" : "100%"; // 1-Spalte = 30vw, 2-Spalten = 100%

  return (
    <div className="container mx-auto px-4 pt-4">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-black/40 px-4 py-3 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-bold text-white flex-shrink-0">
          Challenges
        </h1>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full bg-white/10 placeholder-white/50 text-white px-4 py-2 pl-10 focus:outline-none"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70">
            🔍
          </span>
        </div>

        {/* Nur mit Bildern */}
        <button
          onClick={() => setOnlyWithImages((v) => !v)}
          className="flex items-center space-x-2 transition"
        >
          <span
            className={`w-3 h-3 rounded-full block transition-colors ${
              onlyWithImages ? "bg-teal-300" : "bg-white/30"
            }`}
          />
          <span className="text-sm text-white">Nur mit Bildern</span>
        </button>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((o) => !o)}
            className="flex items-center space-x-1 text-white hover:text-teal-300 transition"
          >
            <Sliders size={20} />
            <span className="text-sm">Sort: {sortKey}</span>
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
                  className={`block w-full text-left px-4 py-2 hover:bg-white/10 transition ${
                    sortKey === key ? "bg-white/20" : ""
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

        {/* View Toggle */}
        <div className="flex items-center">
          <button
            onClick={() => setViewCols(viewCols === 1 ? 2 : 1)}
            className="flex items-center space-x-1 p-2 rounded hover:bg-white/10 transition"
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

      {/* Grid: Immer 1 Spalte (< sm), ab sm ggf. 2 Spalten */}
      <div
        ref={containerRef}
        className="mt-2 overflow-y-auto snap-y snap-mandatory max-h-[calc(100vh-6rem)]"
      >
        <div
          className={`grid gap-6 pb-8 ${
            viewCols === 1 ? "grid-cols-1 justify-items-center" : "grid-cols-2"
          }`}
        >
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
                className="group snap-start"
              >
                <div
                  className="relative flex flex-col overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition duration-300 cursor-pointer group-hover:border-teal-400 group-hover:shadow-lg group-hover:-translate-y-1 group-active:border-teal-500 group-active:shadow-xl"
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                  }}
                >
                  {/* Bild */}
                  <div className="relative h-72 w-full">
                    <Image
                      src={imgUrl}
                      alt={c.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Fortschritts-Kreis */}
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

                  {/* Textbereich */}
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
