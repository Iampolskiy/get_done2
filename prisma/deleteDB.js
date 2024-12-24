import { PrismaClient } from "@prisma/client"; // Prisma importieren

const prisma = new PrismaClient(); // Prisma-Instanz erstellen

async function deleteAllData() {
  await prisma.challenge.deleteMany(); // Löscht alle Challenges
  await prisma.user.deleteMany(); // Löscht alle Benutzer

  console.log("Alle Daten wurden gelöscht!");
}

deleteAllData();
