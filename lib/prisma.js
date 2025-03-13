import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const db = globalThis.prisma || prisma;

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}

// Function to check database connectivity
export async function checkDatabaseConnection() {
    try {
        await db.$connect();
        console.log("✅ Connected to the database successfully.");
    } catch (error) {
        console.log(db.$connect);
        console.error("❌ Error connecting to the database:", error);
        throw new Error("Database connection failed");
    }
}

// Call this function at startup
checkDatabaseConnection();
