// app/allmychallenges/MyChallengesClient.tsx
"use client";

import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type MyChallengesClientProps = {
  challenges: Challenge[];
};

export default function MyChallengesClient({
  challenges,
}: MyChallengesClientProps) {
  return (
    <section className="bg-gray-50 min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header ------------------------------------------------ */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meine Ziele</h1>
          <Link
            href="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Neues Ziel
          </Link>
        </div>

        {/* Grid -------------------------------------------------- */}
        {challenges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
              /* Cover‑Bild: erstes isMain =true, sonst undefined */
              const cover = (challenge.images ?? []).find((img) => img.isMain);

              return (
                <Link
                  key={challenge.id}
                  href={`/allmychallenges/${challenge.id}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  {cover && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={cover.url}
                        alt={challenge.title}
                        fill
                        sizes="(max-width:768px) 100vw, 768px"
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-lg font-semibold text-gray-800">
                        {challenge.title}
                      </h2>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          challenge.completed
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {challenge.completed
                          ? "Abgeschlossen"
                          : "In Bearbeitung"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {challenge.goal}
                    </p>

                    <p className="text-xs text-gray-500 mb-4">
                      Erstellt am{" "}
                      {challenge.created_at?.toLocaleDateString("de-DE")}
                    </p>

                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-blue-500 h-2"
                        style={{ width: `${challenge.progress ?? 0}%` }}
                      />
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Kategorie: {challenge.category ?? "—"}</p>
                      <p>Dauer: {challenge.duration ?? "—"} Tage</p>
                      <p>Schwierigkeit: {challenge.difficulty ?? "—"}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">Keine Ziele gefunden.</p>
        )}
      </div>
    </section>
  );
}
