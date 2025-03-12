import type React from "react";
import type { Metadata } from "next";
import "../../app/globals.css";
import Header from "./_components/header";
import { AppSidebar } from "./_components/sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export const metadata: Metadata = {
    title: "FiOVATE Dashboard",
    description: "Financial management and analytics dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='flex min-h-screen bg-background/10'>
            <SidebarProvider>
                <div className='absolute inset-0 flex justify-center items-center -z-10 '>
                    <div className='w-400 h-400 min-h-screen bg-green-100 bg-pattern rounded-full  opacity-40 blur-2xl animate-pulse hexagon'></div>
                </div>{" "}
                <AppSidebar />
                <SidebarInset className='flex bg-background/25 flex-col'>
                    <Header />
                    <main className='flex-1 p-4 bg-transparent  md:p-6'>
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
