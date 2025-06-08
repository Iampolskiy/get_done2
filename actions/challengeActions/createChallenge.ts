/* actions/challengeActions/createChallenge.ts */
"use server";

import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

/** Datentyp eines hochgeladenen Bildes */
export type UploadedImage = {
  url: string;
  /** true → Titelbild  */
  isMain?: boolean;
};

export async function createChallenge(
  images: UploadedImage[],
  formData: FormData
): Promise<void> {
  console.log("DEBUG - images im Server Action:", images);

  /* ---------- 1) Auth-Check + User anlegen falls nötig ------- */
  const me = await currentUser();
  if (!me) throw new Error("Benutzer ist nicht authentifiziert");

  const email = me.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("Keine E-Mail-Adresse gefunden");

  // ✅ Benutzer suchen oder anlegen
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: me.firstName ?? "Unbekannt",
        clerkId: me.id,
      },
    });
  }

  /* ---------- 2) Form-Daten ---------------------------------- */
  const data = {
    title: (formData.get("title") as string).trim(),
    category: (formData.get("category") as string) || undefined,
    difficulty: (formData.get("difficulty") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    duration: parseInt(formData.get("duration") as string, 10) || undefined,
    progress: parseFloat(formData.get("progress") as string) || undefined,
    age: parseInt(formData.get("age") as string, 10) || undefined,
    gender: (formData.get("gender") as string) || undefined,
    city_address: (formData.get("city_address") as string) || undefined,
    goal: (formData.get("goal") as string) || undefined,
    // Neu: Land aus dem Formular
    country: ((formData.get("country") as string) || "").trim() || undefined,
  };

  /* ---------- 3) Transaktion --------------------------------- */
  await prisma.$transaction(async (tx) => {
    const newChallenge = await tx.challenge.create({
      data: {
        ...data,
        author: { connect: { id: user.id } },
      },
    });

    const coverImages = images.slice(0, 10);

    if (coverImages.length) {
      await tx.image.createMany({
        data: coverImages.map(({ url, isMain }) => ({
          url,
          isMain: isMain ?? true,
          duration: 0,
          challengeId: newChallenge.id,
          userId: user.id,
        })),
      });
    }
  });

  /* ---------- 4) Redirect ------------------------------------ */
  redirect("/allmychallenges?success=true");
}
