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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meine Ziele</h1>
          <Link
            href="/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Neues Ziel
          </Link>
        </div>

        {challenges.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/allmychallenges/${challenge.id}`}
                className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {challenge.images && challenge.images.length > 0 && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={challenge.images[0].url}
                      alt={challenge.title}
                      fill
                      style={{ objectFit: "cover" }}
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
                      {challenge.completed ? "Abgeschlossen" : "In Bearbeitung"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {challenge.goal}
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Erstellt am {challenge.created_at?.toLocaleDateString()}
                  </p>

                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-blue-500 h-2"
                      style={{ width: `${challenge.progress ?? 0}%` }}
                    ></div>
                  </div>

                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Kategorie: {challenge.category}</p>
                    <p>Dauer: {challenge.duration} Tage</p>
                    <p>Schwierigkeit: {challenge.difficulty}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Keine Ziele gefunden.</p>
        )}
      </div>
    </section>
  );
}

/* "use client";

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
    <div className="container mx-auto px-14">
      <h1>Meine Challenges</h1>
      <div>
        {challenges.length > 0 ? (
          <div className=" flex w-full flex-wrap justify-center ">
            {challenges.map((challenge) => (
              <Link
                style={{ width: "390px" }}
                className=" hover:bg-gray-100 challengeCard border border-gray-300 rounded p-4 m-2 "
                key={challenge.id}
                href={`/allmychallenges/${challenge.id}`}
              >
                <h2>{challenge.title}</h2>

                {challenge.images && challenge.images.length > 0 ? (
                  <div className="flex flex-wrap mt-4">
                    {challenge.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image.url} // Pinata-URL
                        alt={`Image ${index} for ${challenge.title}`}
                        width={200}
                        height={200}
                        className="m-2 rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <p>No images available</p>
                )}
                <p>Category: {challenge.category}</p>

                <p>Difficulty: {challenge.difficulty}</p>
                <p>Duration: {challenge.duration} Tage</p>
                <div>
                  Progress:
                  <div className="w-80 bg-gray-200 rounded h-4">
                    <div
                      className="bg-blue-500 h-4 rounded"
                      style={{ width: `${challenge.progress?.toString()}%` }}
                    ></div>
                  </div>
                </div>
                <p>City_Adress: {challenge.city_address}</p>
                <p>Goal: {challenge.goal}</p>
                <p>Completed: {challenge.completed ? "Ja" : "Nein"}</p>
                <p>Created_at: {challenge.created_at?.toLocaleString()}</p>
                <p>Updated_at: {challenge.updated_at?.toLocaleString()}</p>
                <p>Author: {challenge.author.name}</p>
                <p>Age: {challenge.age}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p>Keine Challenges gefunden.</p>
        )}
      </div>
    </div>
  );
}
 */
