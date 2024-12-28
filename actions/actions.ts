// app/actions/challengeActions.ts

"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma"; // Singleton Prisma Client
import { Challenge } from "@prisma/client";

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
    },
  });

  redirect("/allmychallenges?success=true");
}

// Server Action zum Löschen einer Herausforderung
export async function deleteChallenge(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Keine ID angegeben");
  }

  // Authentifiziere den aktuellen Benutzer
  const userNow = await currentUser();
  console.log(userNow);

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
      "Du hast keine Berechtigung, diese Herausforderung zu löschen"
    );
  }

  // Lösche die Herausforderung
  await prisma.challenge.delete({
    where: { id: parseInt(id, 10) },
  });

  // Weiterleitung nach erfolgreichem Löschen
  redirect("/allmychallenges?deletesuccess=true");
}

// Server Action zum Aktualisieren einer Herausforderung
export async function updateChallenge(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string | null;
  const difficulty = formData.get("difficulty") as string | null;
  const progressStr = formData.get("progress") as string | null;
  const completedStr = formData.get("completed") as string | null;

  // Konvertiere string Werte zu den entsprechenden Typen
  const progress = progressStr ? parseFloat(progressStr) : undefined;
  const completed = completedStr === "true" ? true : false;

  if (!id) {
    throw new Error("Keine ID angegeben");
  }

  try {
    // Authentifiziere den aktuellen Benutzer
    const userNow = await currentUser();

    if (!userNow) {
      throw new Error("Benutzer ist nicht authentifiziert");
    }

    const userNowEmail = userNow.emailAddresses?.[0]?.emailAddress;

    if (!userNowEmail) {
      throw new Error(
        "Keine E-Mail-Adresse gefunden für den aktuellen Benutzer"
      );
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
        progress: progress !== undefined ? progress : challenge.progress,
        completed: completed !== undefined ? completed : challenge.completed,
        // Weitere Felder können hier hinzugefügt werden
      },
    });

    // Weiterleitung nach erfolgreichem Aktualisieren
    redirect("/allmychallenges?success=true");
  } catch (error: unknown) {
    console.error("Fehler beim Aktualisieren der Herausforderung:", error);
    // Weiterleitung mit Fehler-Query-Parameter
    redirect(
      `/allmychallenges?success=false&error=${encodeURIComponent(
        (error as Error).message
      )}`
    );
  }
}

// Platzhalter für zukünftige Aktionen (z.B. Markieren als Favorit)
export async function markAsFavorite(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("Keine ID angegeben");
  }

  try {
    // Authentifiziere den aktuellen Benutzer
    const userNow = await currentUser();

    if (!userNow) {
      throw new Error("Benutzer ist nicht authentifiziert");
    }

    const userNowEmail = userNow.emailAddresses?.[0]?.emailAddress;

    if (!userNowEmail) {
      throw new Error(
        "Keine E-Mail-Adresse gefunden für den aktuellen Benutzer"
      );
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
        "Du hast keine Berechtigung, diese Herausforderung zu markieren"
      );
    }

    // Aktualisiere die Herausforderung als Favorit
    /* await prisma.challenge.update({
      where: { id: parseInt(id, 10) },
      data: {
        isFavorite: true, // Angenommen, dein Prisma-Modell hat dieses Feld
      },
    }); */

    // Weiterleitung nach erfolgreichem Markieren
    redirect("/allmychallenges?success=true");
  } catch (error: unknown) {
    console.error("Fehler beim Markieren der Herausforderung:", error);
    // Weiterleitung mit Fehler-Query-Parameter
    redirect(
      `/allmychallenges?success=false&error=${encodeURIComponent(
        (error as Error).message
      )}`
    );
  }
}

// Server Action zum Abrufen der Herausforderungen des aktuellen Benutzers
export async function getMyChallenges(): Promise<Challenge[]> {
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
    include: {
      challenges: true,
    },
  });

  if (!user) {
    throw new Error("Benutzer nicht gefunden");
  }

  return user.challenges;
}
