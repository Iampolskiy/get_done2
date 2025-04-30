/*
  Warnings:

  - You are about to drop the `UpdateProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `edited_at` on the `Challenge` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `updateId` on the `Image` table. All the data in the column will be lost.
  - Made the column `challengeId` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UpdateProgress";
PRAGMA foreign_keys=on;

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
    "updated_at" DATETIME,
    "city_address" TEXT,
    "goal" TEXT,
    CONSTRAINT "Challenge_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Challenge" ("age", "authorId", "category", "city_address", "completed", "created_at", "description", "difficulty", "duration", "gender", "goal", "id", "progress", "title", "updated_at") SELECT "age", "authorId", "category", "city_address", "completed", "created_at", "description", "difficulty", "duration", "gender", "goal", "id", "progress", "title", "updated_at" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "challengeId" INTEGER NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Image_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("challengeId", "created_at", "description", "id", "updated_at", "url", "userId") SELECT "challengeId", "created_at", "description", "id", "updated_at", "url", "userId" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
