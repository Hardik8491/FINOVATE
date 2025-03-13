import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Finovate - Personal Finance Management",
    description: "Manage your personal finances with ease",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang='en'>
                <head>
                    <link rel='icon' href='/logo.svg' sizes='any' />
                </head>
                <body className={`${inter.className}`}>
                    <Header />
                    <main className=''>{children}</main>
                    <Toaster richColors />
                </body>
            </html>
        </ClerkProvider>
    );
}
import "./globals.css";
