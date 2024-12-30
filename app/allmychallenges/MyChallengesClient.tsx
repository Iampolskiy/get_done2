"use client";

import { Challenge } from "@/types/types";
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
                <h2>IMGAE{challenge.image}</h2>
                {/* <div>
                  {challenge.image
                    ? `data:image/png;base64,${btoa(
                        challenge.image.toString()
                      )}`
                    : null}
                </div> */}
                {/* <div>
                  IMAGE:
                  {challenge.image
                    ? `data:image/png;base64,${btoa(
                        challenge.image?.toString() ?? "x"
                      )}`
                    : null}
                </div> */}
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
