import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Finovate - Personal Finance Management",
    description: "Manage your personal finances with ease",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <ClerkProvider>
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    {/* <div className='absolute inset-0 flex justify-center items-center -z-10'>
                        <div className='w-600 h-600 min-h-screen bg-green-600 rounded-full bg-pattern opacity-40 blur-2xl animate-pulse hexagon'></div>
                    </div>{" "} */}
                    <Header />
                    {children}
                    <Toaster richColors />
                </body>
            </ClerkProvider>
        </html>
    );
}
