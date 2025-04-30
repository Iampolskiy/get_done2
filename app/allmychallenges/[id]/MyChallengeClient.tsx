"use client";

import { deleteChallenge } from "@/actions/challengeActions/deleteChallenge";
import { Challenge } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type ChallengeDetailProps = {
  challenge: Challenge;
};

export default function MyChallengeClient({ challenge }: ChallengeDetailProps) {
  return (
    <section className="bg-gray-50 min-h-screen px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
          {challenge.images && challenge.images.length > 0 && (
            <div className="relative h-64 w-full">
              <Image
                src={challenge.images[0].url}
                alt={challenge.title}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-t-xl"
              />
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {challenge.title}
              </h1>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  challenge.completed
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {challenge.completed ? "Abgeschlossen" : "In Bearbeitung"}
              </span>
            </div>

            <p className="text-md text-gray-700 mb-4">{challenge.goal}</p>

            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-blue-500 h-2"
                style={{ width: `${challenge.progress ?? 0}%` }}
              ></div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Kategorie:</strong> {challenge.category}
              </p>
              <p>
                <strong>Dauer:</strong> {challenge.duration} Tage
              </p>
              <p>
                <strong>Schwierigkeit:</strong> {challenge.difficulty}
              </p>
              <p>
                <strong>Erstellt am:</strong>{" "}
                {challenge.created_at?.toLocaleDateString()}
              </p>
              <p>
                <strong>Letztes Update:</strong>{" "}
                {challenge.updated_at?.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* BUTTONS SECTION */}
          <div className="flex flex-col md:flex-row gap-4 p-6">
            <Link href={`/update/${challenge.id}`} className="flex-1">
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition">
                Fortschritt Eintragen
              </button>
            </Link>

            <Link href={`/edit/${challenge.id}`} className="flex-1">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition">
                Challenge Bearbeiten
              </button>
            </Link>

            <form action={deleteChallenge} className="flex-1">
              <input type="hidden" name="id" value={challenge.id} />
              <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition">
                Challenge Löschen
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
