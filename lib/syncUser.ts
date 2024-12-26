// lib/syncUser.ts
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";
import { Headers } from "next/dist/client/components/headers";

export async function getOrCreateUser(headersList: Headers) {
  const prisma = new PrismaClient();
  // Übergib die Header an getAuth
  const { userId, userEmail } = getAuth(headersList);

  console.log("Clerk userId:", userId);
  /*   console.log("Clerk userEmail:", userEmail); */

  if (!userId) {
    throw new Error("Nicht authentifizierter Benutzer.");
  }

  // Überprüfen, ob der Benutzer bereits in der DB existiert
  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  console.log("Gefundener User:", user);

  if (!user) {
    // Benutzer in der DB erstellen
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: userEmail || "", // Optional: E-Mail aus Clerk verwenden
        name: "", // Optional: Weitere Felder initialisieren
      },
    });

    console.log("Erstellter User:", user);
  }

  return user;
}
