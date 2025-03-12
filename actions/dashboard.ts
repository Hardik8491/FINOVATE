"use server";

import aj from "@/lib/arcjet";
import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface SerializedTransaction {
    id: string;
    userId: string;
    name?: string;
    balance?: number;
    amount?: number;
    isDefault?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    [key: string]: unknown;
}

const serializeTransaction = (
    obj: Record<string, unknown>
): SerializedTransaction => {
    const serialized: SerializedTransaction = {
        ...obj,
    } as SerializedTransaction;
    if (obj.balance !== undefined) {
        serialized.balance = Number(obj.balance);
    }
    if (obj.amount !== undefined) {
        serialized.amount = Number(obj.amount);
    }
    return serialized;
};

export async function getUserAccounts(): Promise<SerializedTransaction[]> {
    const userdata = await checkUser();
    if (!userdata) {
        throw new Error("Internal Server Error");
    }
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    try {
        const accounts = await db.account.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        });

        return accounts.map(serializeTransaction);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch accounts");
    }
}

interface CreateAccountData {
    name: string;
    balance: number;
    isDefault: boolean;
}

export async function createAccount(
    data: CreateAccountData
): Promise<{ success: boolean; data: SerializedTransaction }> {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const req = await request();
        const decision = await aj.protect(req, { userId, requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                const { remaining, reset } = decision.reason;
                console.error({
                    code: "RATE_LIMIT_EXCEEDED",
                    details: { remaining, resetInSeconds: reset },
                });
                throw new Error("Too many requests. Please try again later.");
            }
            throw new Error("Request blocked");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) {
            throw new Error("User not found");
        }

        const balanceFloat = parseFloat(String(data.balance));
        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount");
        }

        const existingAccounts = await db.account.findMany({
            where: { userId: user.id },
        });

        const shouldBeDefault =
            existingAccounts.length === 0 ? true : data.isDefault;

        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, data: serializeTransaction(account) };
    } catch (error) {
        throw new Error(
            error instanceof Error ? error.message : "Unknown error"
        );
    }
}

export async function getDashboardData(): Promise<SerializedTransaction[]> {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const transactions = await db.transaction.findMany({
        where: { userId: user.id },
        orderBy: { date: "desc" },
    });

    return transactions.map(serializeTransaction);
}
