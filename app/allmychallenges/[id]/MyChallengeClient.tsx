"use client";
import { deleteChallenge } from "@/actions/actions";
import { Challenge } from "@/types/types";
import React from "react";

type ChallengeClientProps = {
  challenge: Challenge;
};

export default function ChallengesClient({ challenge }: ChallengeClientProps) {
  return (
    <div className="container mx-auto px-14">
      <h1>Challenge {challenge.id} </h1>
      <div className=" flex w-full flex-wrap justify-center ">
        <div>
          <form action={deleteChallenge}>
            <input type="hidden" name="id" value={challenge.id} />
            <button className="bg-blue-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded">
              Delete Challenge
            </button>
          </form>
        </div>
        <div>
          <div className="challengeCard border border-gray-300 rounded p-4 m-2 ">
            <div className="font-bold text-xl mb-2 mt-4 font-family: 'Arial'">
              {challenge.title}
            </div>
            <div>Kategorie: {challenge.category}</div>
            <div>Goal: {challenge.goal}</div>
            <div>
              Progress:
              <div className="w-80 bg-gray-200 rounded h-4">
                <div
                  className="bg-blue-500 h-4 rounded"
                  style={{ width: `${challenge.progress?.toString()}%` }}
                ></div>
              </div>
            </div>
            {/* <div className="my-2 w-2/3">{challenge.description}</div> */}
            <div>Autor: {challenge.author?.name}</div>
            <div>Difficulty: {challenge.difficulty}</div>
            {/* <div>Created At: {challenge.created_at.toLocaleString()}</div>
              <div>Updated At: {challenge.updated_at.toLocaleString()}</div> */}
            <div>
              Status: {challenge.completed ? "Completed" : "In progress"}
            </div>
            <div>City_adress: {challenge.gender}</div>
            {/*               <div>Gender: {challenge.gender}</div> */}
            <div>Age: {challenge.age}</div>
            <div>Duration: {challenge.duration}</div>
            <div>Created_at: {challenge.created_at?.toLocaleString()}</div>
            <div>Updated_at: {challenge.updated_at?.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
