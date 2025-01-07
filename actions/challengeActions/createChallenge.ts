"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma"; // Singleton Prisma Client

export async function createChallenge(formData: FormData): Promise<void> {
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

  // Erstelle die neue Challenge und verbinde sie mit dem authentifizierten Benutzer
  await prisma.challenge.create({
    data: {
      title: formData.get("title") as string,
      category: (formData.get("category") as string) || undefined,
      difficulty: (formData.get("difficulty") as string) || undefined,
      description: (formData.get("description") as string) || undefined,
      duration: formData.get("duration")
        ? parseInt(formData.get("duration") as string, 10)
        : undefined,
      progress: formData.get("progress")
        ? parseFloat(formData.get("progress") as string)
        : undefined,
      age: formData.get("age")
        ? parseInt(formData.get("age") as string, 10)
        : undefined,
      gender: (formData.get("gender") as string) || undefined,
      city_address: (formData.get("city_address") as string) || undefined,
      goal: (formData.get("goal") as string) || undefined,
      completed: false, // Standardwert
      author: {
        connect: {
          id: user.id, // Verwende die tatsächliche Benutzer-ID
        },
      },

      created_at: new Date(),
      updated_at: new Date(),
      image: formData.get("image_url") as string,
    },
  });

  redirect("/allmychallenges?success=true");
}
