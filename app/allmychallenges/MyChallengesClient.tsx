import { Challenge } from "@/types/types";
import React from "react";
type MyChallengesClientProps = {
  challenges: Challenge[];
};

export default function MyChallengesClient({
  challenges,
}: MyChallengesClientProps) {
  return (
    <>
      <div>
        <h1>Meine Challenges</h1>
      </div>
      <div>
        {challenges.length > 0 ? (
          <ul>
            {challenges.map((challenge) => (
              <li key={challenge.id}>
                <h2>{challenge.title}</h2>
                <p>{challenge.description}</p>
                <p>Kategorie: {challenge.category}</p>
                <p>Schwierigkeit: {challenge.difficulty}</p>
                <p>Dauer: {challenge.duration} Tage</p>
                <p>Fortschritt: {challenge.progress}%</p>
                <p>Stadtadresse: {challenge.city_address}</p>
                <p>Ziel: {challenge.goal}</p>
                <p>Abgeschlossen: {challenge.completed ? "Ja" : "Nein"}</p>
                <p>Erstellt am: {challenge.created_at?.toLocaleString()}</p>
                <p>Aktualisiert am: {challenge.updated_at?.toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Keine Challenges gefunden.</p>
        )}
      </div>
    </>
  );
}
