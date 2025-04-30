/*
  Warnings:

  - You are about to drop the `_ImageToUpdate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_ImageToUpdate_B_index";

-- DropIndex
DROP INDEX "_ImageToUpdate_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ImageToUpdate";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    "challengeId" INTEGER NOT NULL,
    "userId" INTEGER,
    "updateId" INTEGER,
    CONSTRAINT "Image_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "Update" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("challengeId", "created_at", "description", "duration", "id", "updateId", "updated_at", "url", "userId") SELECT "challengeId", "created_at", "description", "duration", "id", "updateId", "updated_at", "url", "userId" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
