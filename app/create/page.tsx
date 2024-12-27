import React from "react";
import { currentUser } from "@clerk/nextjs/server";
import { createChallenge } from "@/actions/actions";

export default async function createPage() {
  const userNow = await currentUser();
  const userNowEmail = userNow?.emailAddresses?.[0]?.emailAddress;

  // Überprüfe, ob der Benutzer authentifiziert ist und eine E-Mail-Adresse hat
  if (!userNow || !userNowEmail) {
    return (
      <div>
        <p>Benutzer ist nicht authentifiziert oder E-Mail-Adresse fehlt.</p>
      </div>
    );
  }
  return (
    <>
      <form
        action={createChallenge} // Adjust the action path accordingly
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

        {/* <div className="mb-4">
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
        </div> */}

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

/* 

model Challenge {
  id           Int      @id @default(autoincrement())
  title        String   // TEXT für den Titel
  category     String?  // Optionaler TEXT
  difficulty   String?  // Optionaler Schwierigkeitsgrad
  description  String?  // Feld für die Beschreibung
  duration     Int?     // Integer für die Dauer
  completed    Boolean?  @default(false) // Standardwert ist false
  author       User     @relation(fields: [authorId], references: [id]) // Relation zu User
  authorId     Int      // Fremdschlüssel
  progress     Float?   // Fortschritt als Float-Wert
  age          Int?     // Alter
  gender       String?
  created_at   DateTime?
  updated_at   DateTime?
  city_address String?
  goal         String?
}
  
model User {
  id         Int         @id @default(autoincrement())
  clerkId    String?      @unique // Clerk-Benutzer-ID
  email      String?     @unique // Prisma setzt automatisch TEXT
  name       String?     // TEXT für den Namen
  challenges Challenge[] // Relation zu Challenges
}
 
 


*/

/* import { createChallenge } from "@/actions/actions";

export default async function createPage() {
  
  return (
    <>
      <div>Create New Challenge</div>
      <div>CreateNewClient</div>
      <form
        action={createChallenge}
        className="rounded bg-black-200" 
      >
        <div className="flex flex-col">
          <label htmlFor="title">Title:</label>
          <input className="text-black" type="text" id="title" name="title" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="category">Category:</label>
          <input
            className="text-black"
            type="text"
            id="category"
            name="category"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description">Description:</label>
          <input
            className="text-black"
            type="text"
            id="description"
            name="description"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="goal">Goal:</label>
          <input className="text-black" type="text" id="goal" name="goal" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="duration">Duration:</label>
          <input
            className="text-black"
            type="date"
            id="duration"
            name="duration"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="difficulty">Difficulty:</label>
          <input
            className="text-black"
            type="text"
            id="difficulty"
            name="difficulty"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="age">Age:</label>
          <input className="text-black" type="number" id="age" name="age" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="age">Progress:</label>
          <input
            className="text-black"
            type="number"
            id="progress"
            name="progress"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="gender">Gender:</label>
          <input className="text-black" type="text" id="gender" name="gender" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="city_address">City Address:</label>
          <input
            className="text-black"
            type="text"
            id="city_address"
            name="city_address"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="completed">Completed:</label>
          <input type="radio" value={"true"} id="completed" name="completed" />
        </div>

        <div className="flex flex-col">
    <label htmlFor="author">Author:</label>
    <input className="text-black" type="text" id="author" name="author" />
  </div>

        <div className="flex flex-col">
          <label htmlFor="age">userid:</label>
          <input className="text-black" type="text" id="userid" name="userid" />
        </div>
        <div className="flex flex-row justify-center">
          <button
            className="rounded mt-4 p-2 bg-green-500 w-1/3 h-16"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
    </>
  );
}
 */
/* 
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // verhindert das automatische Neuladen

    // 2) Formulardaten auslesen
    const formData = new FormData(e.currentTarget);

    // 3) In ein Objekt packen (alle Felder, die du im Formular hast)
    const data = {
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
      goal: formData.get("goal"),
      duration: formData.get("duration"), // Achtung: Date/Number?
      difficulty: formData.get("difficulty"),
      age: formData.get("age"),
      gender: formData.get("gender"),
      city_address: formData.get("city_address"),
      // Falls du AuthorId oder Ähnliches mitschicken willst:
      // authorId: 81
    };
 */
