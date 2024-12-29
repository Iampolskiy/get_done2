"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma"; // Singleton Prisma Client

export async function updateChallenge(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string | null;
  const difficulty = formData.get("difficulty") as string | null;
  const progress = formData.get("progress") as string | null;
  const completed = formData.get("completed") as string | null;
  const goal = formData.get("goal") as string | null;
  const age = formData.get("age") as string | null;
  const gender = formData.get("gender") as string | null;
  const city_address = formData.get("city_address") as string | null;
  const duration = formData.get("duration") as string | null;
  // Konvertiere string Werte zu den entsprechenden Typen

  if (!id) {
    throw new Error("Keine ID angegeben");
  }

  // Authentifiziere den aktuellen Benutzer
  const userNow = await currentUser();

  if (!userNow) {
    throw new Error("Benutzer ist nicht authentifiziert");
  }

  const userNowEmail = userNow.emailAddresses?.[0]?.emailAddress;

  if (!userNowEmail) {
    throw new Error("Keine E-Mail-Adresse gefunden für den aktuellen Benutzer");
  }

  // Finde den Benutzer in der Datenbank anhand der E-Mail
  const user = await prisma.user.findUnique({
    where: {
      email: userNowEmail,
    },
  });

  if (!user) {
    throw new Error("Benutzer nicht gefunden");
  }

  // Überprüfe, ob die Herausforderung dem aktuellen Benutzer gehört
  const challenge = await prisma.challenge.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!challenge) {
    throw new Error("Herausforderung nicht gefunden");
  }

  if (challenge.authorId !== user.id) {
    throw new Error(
      "Du hast keine Berechtigung, diese Herausforderung zu aktualisieren"
    );
  }

  // Aktualisiere die Herausforderung
  await prisma.challenge.update({
    where: { id: parseInt(id, 10) },
    data: {
      title: title || challenge.title,
      description: description || challenge.description,
      category: category || challenge.category,
      difficulty: difficulty || challenge.difficulty,
      progress:
        progress !== undefined
          ? parseFloat(progress as string)
          : challenge.progress,
      completed:
        completed !== undefined
          ? completed === "undefined"
          : challenge.completed,
      goal: goal || challenge.goal,
      age: parseInt(age as string, 10) || challenge.age,

      gender: gender || challenge.gender,
      city_address: city_address || challenge.city_address,
      duration: parseInt(duration as string, 10) || challenge.duration,
      authorId: user.id,

      // Weitere Felder können hier hinzugefügt werden
    },
  });

  // Weiterleitung nach erfolgreichem Aktualisieren
  redirect("/allmychallenges?success=true");
}
