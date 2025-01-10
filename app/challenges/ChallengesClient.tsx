"use client";
import { Challenge } from "@/types/types";
import Link from "next/link";
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
      <div className=" flex w-full flex-wrap justify-center ">
        {challenges.map((challenge) => (
          <React.Fragment key={challenge.id}>
            <h2>{challenge.images}</h2>
            <Link
              style={{ width: "390px" }}
              href={`/challenges/${challenge.id}`}
              className=""
            >
              <div className="hover:bg-gray-100 hover:shadow-md  challengeCard border border-gray-300 rounded p-4 m-2 ">
                <div className="font-bold text-xl mb-2 mt-4 font-family: 'Arial'">
                  {challenge.title}
                </div>
                img:
                <div>
                  {challenge.images?.map((img: string) => img.toString())
                    ? "party"
                    : "Null"}
                </div>
                {/* <h1>sdfasdf</h1>
                <div>
                  {challenge.image && Array.isArray(challenge.image) ? (
                    challenge.image.map((index, url) => (
                      <Image
                        key={index}
                        src={url?.toString()}
                        alt={challenge.title}
                        width={200}
                        height={200}
                      />
                    ))
                  ) : challenge.image && typeof challenge.image === "string" ? (
                    <Image
                      src={challenge.image}
                      alt={challenge.title}
                      width={200}
                      height={200}
                    />
                  ) : null}
                </div> */}
                <div>Kategorie: {challenge.category}</div>
                <div>Goal: {challenge.goal}</div>
                <div>
                  Progress:
                  <div className="w-80 bg-gray-200 rounded h-4">
                    <div
                      className="bg-blue-500 h-4 rounded "
                      style={{ width: `${challenge.progress?.toString()}%` }}
                    ></div>
                  </div>
                </div>
                {/* <div className="my-2 w-2/3">{challenge.description}</div> */}
                <div>Autor: {challenge.author.name}</div>
                <div>Difficulty: {challenge.difficulty}</div>
                {/* <div>Created At: {challenge.created_at.toLocaleString()}</div>
              <div>Updated At: {challenge.updated_at.toLocaleString()}</div> */}
                <div>
                  Status: {challenge.completed ? "Completed" : "In progress"}
                </div>
              </div>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
