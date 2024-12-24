import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  // Benutzer-Daten erstellen
  await prisma.user.createMany({
    data: [
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" },
      { name: "Charlie", email: "charlie@example.com" },
      { name: "Diana", email: "diana@example.com" },
      { name: "Eve", email: "eve@example.com" },
      { name: "Frank", email: "frank@example.com" },
      { name: "Grace", email: "grace@example.com" },
      { name: "Heidi", email: "heidi@example.com" },
    ],
  });

  console.log("Benutzer erfolgreich erstellt!");

  const userList = await prisma.user.findMany();

  const challengesData = Array.from({ length: 30 }, (_, index) => {
    const randomUser = userList[Math.floor(Math.random() * userList.length)];
    return {
      title: `Challenge ${index + 1}`,
      category: ["Fitness", "Programming", "Cooking", "Art", "Learning"][
        Math.floor(Math.random() * 5)
      ],
      description: `Description for Challenge Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet ${
        index + 1
      }`,
      difficulty: ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)],
      duration: Math.floor(Math.random() * 120) + 30,
      completed: Math.random() > 0.5,
      authorId: randomUser.id,
      progress: Math.floor(Math.random() * 101),
      age: Math.floor(Math.random() * 50) + 18,
      gender: ["Male", "Female", "Non-Binary"][Math.floor(Math.random() * 3)],
      created_at: new Date(),
      updated_at: new Date(),
      city_adress: ["New York", "Berlin", "Tokyo", "Paris", "London", "Mumbai"][
        Math.floor(Math.random() * 6)
      ],
      goal: [
        "Lose weight",
        "Build muscle",
        "Learn a new skill",
        "Complete a project",
        "Develop a habit",
      ][Math.floor(Math.random() * 5)],
    };
  });

  await prisma.challenge.createMany({
    data: challengesData,
  });

  console.log("Challenges erfolgreich erstellt!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
