/*
  Warnings:

  - You are about to drop the column `updated_at` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Image` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "UpdateProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateText" TEXT NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UpdateProgress_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UpdateProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Challenge" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "difficulty" TEXT,
    "description" TEXT,
    "duration" INTEGER,
    "completed" BOOLEAN DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "progress" REAL,
    "age" INTEGER,
    "gender" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "edited_at" DATETIME,
    "city_address" TEXT,
    "goal" TEXT,
    CONSTRAINT "Challenge_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Challenge" ("age", "authorId", "category", "city_address", "completed", "created_at", "description", "difficulty", "duration", "gender", "goal", "id", "progress", "title") SELECT "age", "authorId", "category", "city_address", "completed", "created_at", "description", "difficulty", "duration", "gender", "goal", "id", "progress", "title" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "edited_at" DATETIME,
    "challengeId" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Image_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("challengeId", "created_at", "description", "id", "url", "userId") SELECT "challengeId", "created_at", "description", "id", "url", "userId" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
