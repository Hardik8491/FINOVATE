"use client";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { SignedIn, UserButton } from "@clerk/nextjs";

const Header = () => {
    const pathname = usePathname();

    const pageNames = {
        "/dashboard": "Dashboard",
        "/account": "Account",
        "/app/journal": "Journal",
        "/app/analytics": "Analytics",
        "/app/notes": "Notes",
        "/app/socials": "Social Network",
    };
    const getCurrentPage = () => {
        const pageNames: Record<string, string> = {
            "/dashboard": "Dashboard",
            "/account": "Account",
            "/app/journal": "Journal",
            "/app/analytics": "Analytics",
            "/app/notes": "Notes",
            "/app/socials": "Socials",
        };

        if (pathname.startsWith("/account")) return "Account";
        if (pathname.startsWith("/dashboard")) return "Dashboard";
        if (pathname.startsWith("/transaction")) return "Transaction";
        if (pathname.startsWith("/settings")) return "Settings";
        if (pathname.startsWith("/payments")) return "Payments";

        return pageNames[pathname] ?? "FiNOVATE";
    };

    const CurrentPage = getCurrentPage();

    return (
        <header className='sticky top-0 z-30 w-full bg-background/75 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'>
            <div className='container flex h-15 items-center justify-between px-4'>
                <div className='flex items-center md:hidden'>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='md:hidden'
                            >
                                <Menu className='h-5 w-5' />
                                <span className='sr-only'>Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side='left'
                            className='w-[80%] sm:w-[350px]'
                        >
                            <div className='flex flex-col h-full'>
                                <div className='flex items-center justify-between pb-4 border-b'>
                                    <Link
                                        href='/'
                                        className='flex items-center space-x-2'
                                    >
                                        <span className='font-semibold text-primary'>
                                            FiOVATE
                                        </span>
                                    </Link>
                                </div>
                                <div className='flex-1 py-6'>
                                    <div className='flex flex-col space-y-3'>
                                        {Object.entries(pageNames).map(
                                            ([href, label]) => (
                                                <SheetClose asChild key={href}>
                                                    <Link
                                                        href={href}
                                                        className='flex items-center py-2 text-muted-foreground hover:text-foreground'
                                                    >
                                                        <span className='ml-3'>
                                                            {label}
                                                        </span>
                                                    </Link>
                                                </SheetClose>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className='hidden md:flex md:flex-1 md:items-center md:justify-start'>
                    <h1 className='text-2xl font-bold tracking-tight'>
                        {CurrentPage}
                    </h1>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='hidden md:flex md:flex-1 md:items-center md:justify-start'>
                        <div className='relative w-full max-w-md'>
                            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                            <Input
                                type='search'
                                placeholder='Search...'
                                className='w-full bg-background pl-8 md:w-[300px] lg:w-[400px]'
                            />
                        </div>
                    </div>
                    <Button
                        variant='outline'
                        size='icon'
                        className='rounded-full'
                        aria-label='Notifications'
                    >
                        <Bell className='h-4 w-4' />
                    </Button>
                    <div className='flex items-center space-x-3'>
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-9 h-9",
                                        userButtonTrigger:
                                            "focus:shadow-none focus:ring-0 focus:ring-offset-0",
                                    },
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
