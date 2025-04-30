"use client";

import { editChallenge } from "@/actions/challengeActions/editChallenge";
import { Challenge } from "@/types/types";
/* import { log } from "console";
 */
import Image from "next/image";
import React, { useState, useRef } from "react";

type ChallengeClientProps = {
  challenge: Challenge;
};

export default function EditClient({ challenge }: ChallengeClientProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([
    ...(challenge.images?.map((image) => image.url) || []),
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log("imageUrls", imageUrls);
  const [isUploading, setUploading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    await editChallenge(formData, imageUrls);
  };
  return (
    <>
      {challenge.id}
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-6 bg-white shadow-md rounded"
      >
        <h2 className="text-2xl font-bold mb-4">Edit {challenge.title}</h2>
        <div>
          <div>
            {imageUrls.length > 0 &&
              imageUrls.map((imageUrl, index) => (
                <Image
                  onClick={() => {
                    setImageUrls(imageUrls.filter((url) => url !== imageUrl));
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                    console.log(imageUrls);
                    return imageUrls;
                  }}
                  key={imageUrl + index}
                  src={imageUrl}
                  alt="INGAGE"
                  width={200}
                  height={200}
                />
              ))}
          </div>
        </div>

        <label htmlFor="image" className="block text-gray-700">
          {isUploading ? "Uploading..." : "Image:"}
        </label>
        <input
          ref={fileInputRef}
          disabled={isUploading}
          type="file"
          id={imageUrls[0]}
          name={imageUrls[0]}
          className="w-full mt-1 p-2 border rounded"
          onChange={async (e) => {
            setUploading(true);
            const files = Array.from(e.target.files ?? []);
            const uploadedUrls: string[] = [];
            for (const file of files) {
              const data = new FormData();
              data.set("file", file);
              try {
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: data,
                });
                if (!res.ok) throw new Error(res.statusText);
                const json = await res.json();
                uploadedUrls.push(json.url); // Nur die URL speichern
              } catch (err) {
                console.error("Upload failed:", err);
              }
            }
            setImageUrls((prev) => [...prev, ...uploadedUrls]);
            setUploading(false);
          }}
        />

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
        <input type="hidden" name="id" value={challenge.id} readOnly hidden />

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
          {isUploading ? "Uploading..." : "Save"}
        </button>
      </form>
    </>
  );
}
