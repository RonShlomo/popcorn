/*
  Warnings:

  - You are about to drop the column `showTimeId` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `showtimeId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_showTimeId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "showTimeId",
ADD COLUMN     "showtimeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
