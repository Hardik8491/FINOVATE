"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

const Header = () => {
    return (
        <header className='fixed container top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b'>
            <div className='container flex h-16 items-center justify-between px-4'>
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
                                        {[
                                            {
                                                href: "/app",
                                                label: "Dashboard",
                                                icon: "Home",
                                            },
                                            {
                                                href: "/app/journal",
                                                label: "Journal",
                                                icon: "FileText",
                                            },
                                            {
                                                href: "/app/analytics",
                                                label: "Analytics",
                                                icon: "BarChart",
                                            },
                                            {
                                                href: "/app/notes",
                                                label: "Notes",
                                                icon: "StickyNote",
                                            },
                                            {
                                                href: "/app/socials",
                                                label: "Social Network",
                                                icon: "Users",
                                            },
                                        ].map((item) => (
                                            <SheetClose asChild key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    className='flex items-center py-2 text-muted-foreground hover:text-foreground'
                                                >
                                                    <span className='ml-3'>
                                                        {item.label}
                                                    </span>
                                                </Link>
                                            </SheetClose>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className='hidden md:flex md:flex-1  top-0  md:items-center md:justify-start'>
                    <div className='relative w-full max-w-md'>
                        <h1 className='text-2xl font-bold tracking-tight'>
                            FiNOVATE
                        </h1>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='ghost'
                                className='relative h-8 w-8 rounded-full'
                            >
                                <Avatar className='h-8 w-8'>
                                    <AvatarImage
                                        src='/placeholder.svg?height=32&width=32'
                                        alt='@user'
                                    />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-56'
                            align='end'
                            forceMount
                        >
                            <DropdownMenuLabel className='font-normal'>
                                <div className='flex flex-col space-y-1'>
                                    <p className='text-sm font-medium leading-none'>
                                        User
                                    </p>
                                    <p className='text-xs leading-none text-muted-foreground'>
                                        user@example.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
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

                        <SignedOut>
                            <SignInButton forceRedirectUrl='/dashboard'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='hidden sm:flex'
                                >
                                    Login
                                </Button>
                            </SignInButton>
                            <SignInButton forceRedirectUrl='/dashboard'>
                                <Button size='sm' className='hidden sm:flex'>
                                    Sign Up
                                </Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
