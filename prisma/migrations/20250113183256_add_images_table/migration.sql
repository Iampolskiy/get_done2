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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
