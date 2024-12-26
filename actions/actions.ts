"use server";
import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

export async function createChallenge(formdata: FormData) {
  const prisma = new PrismaClient();

  const userNow = await currentUser();

  if (!userNow) {
    throw new Error("Benutzer ist nicht authentifiziert");
  }
  const userNowId = userNow?.id;
  const userNowEmail = userNow.emailAddresses?.[0]?.emailAddress;

  console.log("Aktuelle Benutzer-E-Mail:", userNowEmail);

  const user = await prisma.user.findUnique({
    where: {
      email: userNowEmail,
    },
  });

  console.log("Benutzer:", user);
  console.log("userNowId:", userNowId);

  if (!user) {
    throw new Error("Benutzer nicht gefunden");
  }

  await prisma.challenge.create({
    include: {
      author: true,
    },

    data: {
      title: formdata.get("title") as string,
      category: formdata.get("category") as string,
      difficulty: formdata.get("difficulty") as string,
      description: formdata.get("description") as string,
      duration: parseInt(formdata.get("duration") as string, 10) as number,
      completed: false,
      goal: formdata.get("goal") as string,
      age: parseInt(formdata.get("age") as string, 10) as number,
      gender: formdata.get("gender") as string,
      city_address: formdata.get("city_address") as string,
      progress: parseInt(formdata.get("progress") as string, 10) as number,
      created_at: new Date(),
      updated_at: new Date(),
      author: {
        connect: {
          id: 91, // Replace with the actual author's ID
        },
      },
    },
  });
}

/* export async function getUserEmail(email: string) {
  const prisma = new PrismaClient();

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user?.id;
} */
