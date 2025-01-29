"use client";

import { createChallenge } from "@/actions/challengeActions/createChallenge";
import Image from "next/image";
import React, { useState } from "react";

export default function CreateClient() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setUploading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    await createChallenge(imageUrls, formData); // Pass both formData and imageUrls as arguments to createChallenge
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
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
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        {/* Bild-Upload-Feld */}
        <div>
          <div>
            {imageUrls.length > 0 &&
              imageUrls.map((imageUrl) => (
                <Image
                  onClick={() => {
                    setImageUrls(imageUrls.filter((url) => url !== imageUrl));
                    console.log(imageUrls);
                    return imageUrls;
                  }}
                  key={imageUrl}
                  src={imageUrl}
                  alt="INGAGE"
                  width={200}
                  height={200}
                />
              ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700">
            {isUploading ? "Uploading..." : "Image:"}
          </label>
          <input
            disabled={isUploading}
            type="file"
            id={imageUrls[0]}
            name={imageUrls[0]}
            className="w-full mt-1 p-2 border rounded"
            onChange={async (e) => {
              setUploading(true);
              const file = e.target.files?.[0] as File;
              console.log(file);
              const data = new FormData();
              data.set("file", file);
              try {
                if (!file) {
                  return (
                    <>
                      <h1>Kein File</h1>
                    </>
                  );
                } else {
                  const uploadRequest = await fetch("/api/test", {
                    // Stelle sicher, dass die URL korrekt ist
                    method: "POST",
                    body: data,
                  });
                  if (!uploadRequest.ok)
                    throw new Error(uploadRequest.statusText);

                  if (uploadRequest.ok) {
                    const uploadResponse = await uploadRequest.json();
                    console.log(uploadResponse);

                    setImageUrls([...imageUrls, uploadResponse]);
                    console.log(uploadResponse);
                  }
                }
              } catch (error) {
                console.error(error);
              }
              setUploading(false);
            }}
          />
        </div>

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
          disabled={isUploading}
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isUploading ? "Uploading..." : "Create Challenge"}
        </button>
      </form>
    </>
  );
}
