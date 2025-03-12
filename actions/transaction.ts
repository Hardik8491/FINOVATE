"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { Account } from "./account";

import { Prisma } from "@prisma/client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

interface TransactionData {
    accountId: string;
    amount: number;
    type: "EXPENSE" | "INCOME";
    date: string;
    description?: string;
    category?: string;
    isRecurring?: boolean;
    recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}

interface ReceiptData {
    amount: number;
    date: Date;
    description: string;
    merchantName: string;
    category: string;
}

const serializeAmount = (obj: Account) => ({
    ...obj,
    amount: obj.amount,
});

export async function createTransaction(data: TransactionData) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const req = await request();
        const decision = await aj.protect(req, { userId, requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                throw new Error("Too many requests. Please try again later.");
            }
            throw new Error("Request blocked");
        }

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });
        if (!user) throw new Error("User not found");

        const account = await db.account.findUnique({
            where: { id: data.accountId, userId: user.id },
        });
        if (!account) throw new Error("Account not found");

        const balanceChange =
            data.type === "EXPENSE" ? -data.amount : data.amount;
        const newBalance = account.balance.toNumber() + balanceChange;

        const transaction = await db.$transaction(
            async (tx: Prisma.TransactionClient) => {
                const newTransaction = await tx.transaction.create({
                    data: {
                        ...data,
                        userId: user.id,
                        category: data.category as string,
                        nextRecurringDate:
                            data.isRecurring && data.recurringInterval
                                ? calculateNextRecurringDate(
                                      data.date,
                                      data.recurringInterval
                                  )
                                : null,
                    },
                });

                await tx.account.update({
                    where: { id: data.accountId },
                    data: { balance: newBalance },
                });

                return newTransaction;
            }
        );

        revalidatePath("/dashboard");
        revalidatePath(`/account/${transaction.accountId}`);

        return { success: true, data: serializeAmount(transaction) };
    } catch (error: unknown) {
        throw new Error(
            error instanceof Error ? error.message : "An unknown error occurred"
        );
    }
}

export async function scanReceipt(file: File): Promise<ReceiptData> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString("base64");

        const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }
    `;

        const result = await model.generateContent([
            { inlineData: { data: base64String, mimeType: file.type } },
            prompt,
        ]);

        const response = await result.response;
        const text = response
            .text()
            .replace(/```(?:json)?\n?/g, "")
            .trim();

        const data = JSON.parse(text);
        return {
            amount: parseFloat(data.amount),
            date: new Date(data.date),
            description: data.description,
            category: data.category,
            merchantName: data.merchantName,
        };
    } catch (error: unknown) {
        throw new Error(
            error instanceof Error ? error.message : "An unknown error occurred"
        );
    }
}

function calculateNextRecurringDate(
    startDate: string,
    interval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
): Date {
    const date = new Date(startDate);
    switch (interval) {
        case "DAILY":
            date.setDate(date.getDate() + 1);
            break;
        case "WEEKLY":
            date.setDate(date.getDate() + 7);
            break;
        case "MONTHLY":
            date.setMonth(date.getMonth() + 1);
            break;
        case "YEARLY":
            date.setFullYear(date.getFullYear() + 1);
            break;
    }
    return date;
}
