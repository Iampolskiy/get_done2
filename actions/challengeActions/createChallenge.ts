"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function createChallenge(
  imageUrls: string[],
  formData: FormData
): Promise<void> {
  // Authentifiziere den aktuellen Benutzer
  const userNow = await currentUser();
  if (!userNow) throw new Error("Benutzer ist nicht authentifiziert");

  const userNowEmail = userNow.emailAddresses?.[0]?.emailAddress;
  if (!userNowEmail) throw new Error("Keine E-Mail-Adresse gefunden");

  const user = await prisma.user.findUnique({
    where: { email: userNowEmail },
  });
  if (!user) throw new Error("Benutzer nicht gefunden");

  // Extrahiere die Challenge-Daten aus dem Formular
  const challengeData = {
    title: formData.get("title") as string,
    category: (formData.get("category") as string) || undefined,
    difficulty: (formData.get("difficulty") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    duration: parseInt(formData.get("duration") as string, 10) || undefined,
    progress: parseFloat(formData.get("progress") as string) || undefined,
    age: parseInt(formData.get("age") as string, 10) || undefined,
    gender: (formData.get("gender") as string) || undefined,
    city_address: (formData.get("city_address") as string) || undefined,
    goal: (formData.get("goal") as string) || undefined,
  };

  // Verwende eine Prisma-Transaktion für die atomare Erstellung von Challenge und Bildern
  await prisma.$transaction(async (tx) => {
    // Schritt 1: Erstelle die Challenge und speichere ihre ID
    const newChallenge = await tx.challenge.create({
      data: {
        ...challengeData,
        author: {
          connect: {
            id: user.id, // Verknüpfe den Benutzer mit der Challenge
          },
        },
      },
    });

    // Schritt 2: Erstelle die Bilder und verbinde sie mit der Challenge
    await tx.image.createMany({
      data: imageUrls.map((url) => ({
        url,
        duration: 0, // Beispielwert
        challengeId: newChallenge.id, // Verwende die generierte ID der Challenge
        userId: user.id, // Optional: Verknüpfe die Bilder auch mit dem Benutzer
      })),
    });
  });

  // Weiterleitung nach erfolgreicher Erstellung
  redirect("/allmychallenges?success=true");
}
