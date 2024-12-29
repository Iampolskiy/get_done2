import { updateChallenge } from "@/actions/challengeActions/updateChallenge";
import { Challenge } from "@/types/types";
import React from "react";

type ChallengeClientProps = {
  challenge: Challenge;
};

export default function EditClient({ challenge }: ChallengeClientProps) {
  return (
    <>
      {challenge.id}
      <form
        action={updateChallenge} // Adjust the action path accordingly
        className="max-w-lg mx-auto p-6 bg-white shadow-md rounded"
      >
        <h2 className="text-2xl font-bold mb-4">Create New Challenge</h2>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>
        {/* hidden input id für die action updatechallenge */}
        <input
          type="hidden"
          name="id"
          value={challenge.id}
          readOnly
          hidden
          id="id"
        />

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700">
            Category:
          </label>
          <input
            type="text"
            id="category"
            name="category"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="difficulty" className="block text-gray-700">
            Difficulty:
          </label>
          <input
            type="text"
            id="difficulty"
            name="difficulty"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full mt-1 p-2 border rounded"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="duration" className="block text-gray-700">
            Duration (Days):
          </label>
          <input
            type="number"
            id="duration"
            name="duration"
            min="1"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="progress" className="block text-gray-700">
            Progress (%):
          </label>
          <input
            type="number"
            id="progress"
            name="progress"
            min="0"
            max="100"
            step="0.1"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="block text-gray-700">
            Age:
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="0"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="gender" className="block text-gray-700">
            Gender:
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="city_address" className="block text-gray-700">
            City Address:
          </label>
          <input
            type="text"
            id="city_address"
            name="city_address"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="goal" className="block text-gray-700">
            Goal:
          </label>
          <input
            type="text"
            id="goal"
            name="goal"
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create
        </button>
      </form>
    </>
  );
}
