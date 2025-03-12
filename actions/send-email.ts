"use server";

import { Resend } from "resend";

// Define the email parameters type
interface SendEmailParams {
    to: string | string[];
    subject: string;
    react: React.ReactElement;
}

// Define API response type
interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

export async function sendEmail({
    to,
    subject,
    react,
}: SendEmailParams): Promise<ApiResponse> {
    const resend = new Resend(process.env.RESEND_API_KEY || "");

    try {
        const data = await resend.emails.send({
            from: "Finance App <onboarding@resend.dev>",
            to,
            subject,
            react,
        });

        return { success: true, data };
    } catch (error: unknown) {
        console.error("Failed to send email:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        };
    }
}
