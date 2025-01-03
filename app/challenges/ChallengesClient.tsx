"use client";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { Challenge } from "@/types/types";
import Link from "next/link";
import React from "react";

type ChallengesClientProps = {
  challenges: Challenge[];
};

export default function ChallengesClient({
  challenges,
}: ChallengesClientProps) {
  return (
    <div className="container mx-auto px-14">
      <h1>Challenges</h1>
      <div className=" flex w-full flex-wrap justify-center ">
        {challenges.map((challenge) => (
          <Link
            style={{ width: "390px" }}
            href={`/challenges/${challenge.id}`}
            className=""
            key={challenge.id}
          >
            <div className="hover:bg-gray-100 hover:shadow-md  challengeCard border border-gray-300 rounded p-4 m-2 ">
              <div className="font-bold text-xl mb-2 mt-4 font-family: 'Arial'">
                {challenge.title}
              </div>

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
              <CldImage
                src="cld-sample-5" // Use this sample image or upload your own via the Media Explorer
                width="400" // Transform the image: auto-crop to square aspect_ratio
                height="400"
                alt="CldOgImage"
                crop={{
                  type: "auto",
                  source: true,
                }}
              />
            </div>
          </Link>
        ))}
      </div>

      <CldUploadWidget uploadPreset="IMG_upload1">
        {({ open }) => {
          return (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => open()}
            >
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
