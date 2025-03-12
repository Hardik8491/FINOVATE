"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
export interface Account {
    id: string;
    name: string;
    type: string;
    amount?: number;
    balance: number;
    isDefault: boolean;
    currency: string;
    description?: string;
    status: string;
    icon?: string;
    accountNumber?: string;
    interestRate?: string;
    goalAmount?: string;
    lastTransactionAt?: Date;
    linkdedAccounts?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define API response type
interface ApiResponse {
    success: boolean;
    error?: string;
}

// Define Transaction type (if not already available from Prisma)
interface Transaction {
    id: string;
    userId: string;
    accountId: string;
    type: "EXPENSE" | "INCOME";
    amount: number;
}

const serializeDecimal = (obj: Account) => {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance;
    }
    if (obj.amount) {
        serialized.amount = obj.amount;
    }
    return serialized;
};

export async function getAccount(id: string): Promise<Account | null> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        select: { id: true }, // Only fetch user ID
    });

    if (!user) throw new Error("User not found");

    const account = await db.account.findUnique({
        where: {
            id,
            userId: user.id,
        },
    });

    return account ? serializeDecimal(account) : null;
}

export async function getAccountWithTransactions(accountId: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const account = await db.account.findUnique({
        where: {
            id: accountId,
            userId: user.id,
        },
        include: {
            transactions: {
                orderBy: { date: "desc" },
            },
            _count: {
                select: { transactions: true },
            },
        },
    });

    if (!account) return null;

    return {
        ...serializeDecimal(account),
        transactions: account.transactions.map(serializeDecimal),
    };
}

export async function bulkDeleteTransactions(
    transactionIds: string[]
): Promise<ApiResponse> {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            select: { id: true },
        });

        if (!user) throw new Error("User not found");

        // Get transactions to calculate balance changes
        const transactions: Transaction[] = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id,
            },
        });

        if (transactions.length === 0) {
            return { success: false, error: "No transactions found" };
        }

        // Group transactions by account to update balances
        const accountBalanceChanges: Record<string, number> =
            transactions.reduce(
                (acc, transaction) => {
                    const change =
                        transaction.type === "EXPENSE"
                            ? transaction.amount
                            : -transaction.amount;
                    acc[transaction.accountId] =
                        (acc[transaction.accountId] || 0) + change;
                    return acc;
                },
                {} as Record<string, number>
            );

        // Delete transactions and update account balances in a transaction
        await db.$transaction(async (tx: Prisma.TransactionClient) => {
            // Delete transactions
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id,
                },
            });

            // Update account balances
            for (const [accountId, balanceChange] of Object.entries(
                accountBalanceChanges
            )) {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange,
                        },
                    },
                });
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/account/[id]");

        return { success: true };
    } catch (error: unknown) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}

export async function updateDefaultAccount(accountId: string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // First, unset any existing default account
        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true,
            },
            data: { isDefault: false },
        });

        // Then set the new default account
        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id,
            },
            data: { isDefault: true },
        });

        revalidatePath("/dashboard");
        return { success: true, data: serializeDecimal(account) };
    } catch (error: unknown) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}

export async function deleteAccount(accountId: string) {
    try {
        await db.account.delete({
            where: { id: accountId },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error: unknown) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}

export async function updateAccountSettings(
    accountId: string,
    settings: Account
) {
    try {
        console.log(settings);
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        const updatedAccount = await db.account.update({
            where: {
                id: accountId,
                userId: user.id,
            },
            data: {
                name: settings.name,
                type: settings.type,
                status: settings.status,
                interestRate: settings.interestRate,
                currency: settings.currency,
                // goalAmout: settings.goalAmount,
                // linkedAccounts: settings.linkedAccounts,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, data: serializeDecimal(updatedAccount) };
    } catch (error: unknown) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}
