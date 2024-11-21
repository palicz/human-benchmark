/*
  Warnings:

  - A unique constraint covering the columns `[playerName]` on the table `Scoreboard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Scoreboard_playerName_key" ON "Scoreboard"("playerName");
