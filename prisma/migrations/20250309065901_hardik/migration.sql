/*
  Warnings:

  - Added the required column `endDate` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `budgets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'UPI');

-- DropIndex
DROP INDEX "budgets_userId_key";

-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "goalAmount" DECIMAL(65,30),
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "interestRate" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "lastTransactionAt" TIMESTAMP(3),
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "budgets" ADD COLUMN     "category" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "merchant" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
ADD COLUMN     "splitWithUsers" JSONB;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "currencyPreference" TEXT DEFAULT 'USD',
ADD COLUMN     "languagePreference" TEXT DEFAULT 'en',
ADD COLUMN     "phoneNumber" TEXT;
