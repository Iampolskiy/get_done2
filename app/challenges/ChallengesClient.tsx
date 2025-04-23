"use client";

import { Challenge } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import React from "react";

type ChallengesClientProps = {
  challenges: Challenge[];
};

export default function ChallengesClient({
  challenges,
}: ChallengesClientProps) {
  console.log(challenges);

  return (
    <div className="container mx-auto px-14">
      <h1>Challenges</h1>
      <div className="flex w-full flex-wrap justify-center">
        {challenges.map((challenge) => (
          <React.Fragment key={challenge.id}>
            <Link
              href={`/challenges/${challenge.id}`}
              style={{ width: "390px" }}
              className="hover:bg-gray-100 hover:shadow-md challengeCard border border-gray-300 rounded p-4 m-2"
            >
              <div className="font-bold text-xl mb-2 mt-4 font-family: 'Arial'">
                {challenge.title}
              </div>
              <div>
                {challenge.images && challenge.images.length > 0 ? (
                  <div className="flex flex-wrap mt-4 ">
                    {challenge.images.map((imageUrl, index) => (
                      <Image
                        key={index}
                        src={imageUrl.toString()} // Cloudinary-URL
                        alt={`Image for ${challenge.title}`}
                        width={200}
                        height={200}
                        className="m-2 rounded"
                      />
                    ))}
                  </div>
                ) : (
                  <p>Keine Bilder verfügbar</p>
                )}
              </div>

              <div>Kategorie: {challenge.category || "Keine Kategorie"}</div>
              <div>Goal: {challenge.goal || "Kein Ziel"}</div>
              <div>
                Progress:
                <div className="w-80 bg-gray-200 rounded h-4">
                  <div
                    className="bg-blue-500 h-4 rounded"
                    style={{ width: `${challenge.progress || 0}%` }}
                  ></div>
                </div>
              </div>
              <div>Autor: {challenge.author.name || "Unbekannt"}</div>
              <div>Difficulty: {challenge.difficulty || "Keine Angabe"}</div>
              <div>
                Status: {challenge.completed ? "Completed" : "In progress"}
              </div>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
