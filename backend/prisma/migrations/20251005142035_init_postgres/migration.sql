-- CreateTable
CREATE TABLE "Check" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "originalClaim" TEXT NOT NULL,
    "cleanedClaim" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "checkedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Source" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publishedAt" TEXT NOT NULL,
    "snippet" TEXT NOT NULL,
    "reliabilityScore" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkId" TEXT,
    CONSTRAINT "Source_checkId_fkey" FOREIGN KEY ("checkId") REFERENCES "Check" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Source_url_key" ON "Source"("url");
