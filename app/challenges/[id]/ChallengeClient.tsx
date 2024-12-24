"use client";

import { Challenge } from "@/types/types";
import React from "react";

type ChallengeClientProps = {
  challenge: Challenge;
};

export default function ChallengeClient({ challenge }: ChallengeClientProps) {
  return (
    <>
      <h2 className="text-2xl font-bold m-4 text-center">Challenge Details</h2>
      <div className="challengeCard border border-gray-300 rounded p-4 m-2 ">
        <div className="font-bold text-xl mb-2 mt-4 font-family: 'Arial'">
          {challenge?.title}
        </div>
        <div>ID: {challenge?.id}</div>
        <div>Title: {challenge?.title}</div>
        <div>Category: {challenge?.category}</div>
        <div>Desrciption: {challenge?.description}</div>
        <div>Goal: {challenge?.goal}</div>
        <div>Progress:</div>
        <div className="w-80 bg-gray-200 rounded h-4">
          <div
            className="bg-blue-500 h-4 rounded"
            style={{ width: `${challenge?.progress.toString()}%` }}
          ></div>
        </div>
        <div>AuthorId: {challenge.author?.name}</div>
        <div>City_adress: {challenge?.city_adress}</div>
        <div>Gender: {challenge?.gender}</div>
        <div>Age: {challenge?.age}</div>
        <div>Duration: {challenge?.duration}</div>
        <div>Difficulty: {challenge?.difficulty}</div>
        <div>Updated_at: {challenge?.updated_at.toDateString()}</div>
        <div>Created_at: {challenge?.created_at.toString()}</div>
      </div>
    </>
  );
}
