/*
  Warnings:

  - You are about to alter the column `image` on the `Challenge` table. The data in that column could be lost. The data in that column will be cast from `String` to `Binary`.

*/
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
    "created_at" DATETIME,
    "updated_at" DATETIME,
    "city_address" TEXT,
    "goal" TEXT,
    "image" BLOB,
    CONSTRAINT "Challenge_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Challenge" ("age", "authorId", "category", "city_address", "completed", "created_at", "description", "difficulty", "duration", "gender", "goal", "id", "image", "progress", "title", "updated_at") SELECT "age", "authorId", "category", "city_address", "completed", "created_at", "description", "difficulty", "duration", "gender", "goal", "id", "image", "progress", "title", "updated_at" FROM "Challenge";
DROP TABLE "Challenge";
ALTER TABLE "new_Challenge" RENAME TO "Challenge";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
