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
    <div className="container mx-auto px-14">
      <h1>Meine Challenges</h1>

      {/* <Image
        src="https://sapphire-obliged-puma-478.mypinata.cloud/files/bafybeif72pd3u2q2rws5w3dpvjliw66ool4ehjkedtowxmvcxkb4533f5m?X-Algorithm=PINATA1&X-Date=1738117997&X-Expires=30&X-Method=GET&X-Signature=4e7ea9239ae921061e519831f48e38e8c341f974cd8ae0df5e50816f0a8e5ba6"
        alt="Logo"
        width={100}
        height={100}
        className="m-2 rounded"
      /> */}
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
