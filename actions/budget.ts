"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Define API response types
interface Budget {
    id: string;
    userId: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
}

interface BudgetResponse {
    budget: Budget | null;
    currentExpenses: number;
}

interface ApiResponse<T = null> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function getCurrentBudget(
    accountId: string
): Promise<BudgetResponse> {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            select: { id: true }, // Only fetch the user ID
        });

        if (!user) {
            throw new Error("User not found");
        }

        const budget = await db.budget.findFirst({
            where: { userId: user.id },
        });

        // Get current month's expenses
        const currentDate = new Date();
        const startOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        const endOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

        const expenses = await db.transaction.aggregate({
            where: {
                userId: user.id,
                type: "EXPENSE",
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                accountId,
            },
            _sum: {
                amount: true,
            },
        });

        return {
            budget: budget
                ? { ...budget, amount: budget.amount.toNumber() }
                : null,
            currentExpenses: expenses._sum.amount
                ? expenses._sum.amount.toNumber()
                : 0,
        };
    } catch (error) {
        console.error("Error fetching budget:", error);
        throw error;
    }
}

export async function updateBudget(
    amount: number
): Promise<ApiResponse<Budget>> {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
            select: { id: true },
        });

        if (!user) throw new Error("User not found");

        // Update or create budget
        const budget = await db.budget.upsert({
            where: {
                userId: user.id,
            },
            update: {
                amount,
            },
            create: {
                userId: user.id,
                amount,
            },
        });

        revalidatePath("/dashboard");

        return {
            success: true,
            data: { ...budget, amount: budget.amount.toNumber() },
        };
    } catch (error: unknown) {
        console.error("Error updating budget:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}
