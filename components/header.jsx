"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { PenBox, LayoutDashboard, PieChart, Briefcase, Settings, Menu, ChevronDown } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <nav className="container flex items-center justify-between px-4 py-3 mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Finovate Logo" width={28} height={28} className="" priority />
          <span className="hidden text-3xl text-primary font-semibold sm:inline-block">FiOVATE</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="items-center hidden space-x-6 md:flex">
          <SignedIn>
            <Link href="/dashboard" className="text-gray-600 transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/budgeting" className="text-gray-600 transition-colors hover:text-primary">
              Budgeting
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-gray-600 transition-colors hover:text-primary">
                More <ChevronDown className="w-4 h-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/reports" className="cursor-pointer">
                    Reports
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/investments" className="cursor-pointer">
                    Investments
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <a href="#features" className="text-gray-600 transition-colors hover:text-primary">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 transition-colors hover:text-primary">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-600 transition-colors hover:text-primary">
              Testimonials
            </a>
          </SignedOut>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <SignedIn>
            <Link href="/transaction/create" className="hidden sm:block">
              <Button size="sm" className="flex items-center gap-1.5">
                <PenBox size={16} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                  userButtonTrigger: "focus:shadow-none focus:ring-0 focus:ring-offset-0",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                Login
              </Button>
            </SignInButton>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button size="sm" className="hidden sm:flex">
                Sign Up
              </Button>
            </SignInButton>
          </SignedOut>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[350px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4 border-b">
                  <Link href="/" className="flex items-center space-x-2">
                    <Image src="/logo.svg" alt="Finovate Logo" width={32} height={32} className="rounded-full" />
                    <span className="font-semibold">Finovate</span>
                  </Link>
                </div>

                <div className="flex-1 py-6">
                  <SignedIn>
                    <div className="flex flex-col space-y-3">
                      <SheetClose asChild>
                        <Link href="/dashboard" className="flex items-center py-2 text-gray-700 hover:text-primary">
                          <LayoutDashboard className="w-5 h-5 mr-3" />
                          Dashboard
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/budgeting" className="flex items-center py-2 text-gray-700 hover:text-primary">
                          <PieChart className="w-5 h-5 mr-3" />
                          Budgeting
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/reports" className="flex items-center py-2 text-gray-700 hover:text-primary">
                          <PieChart className="w-5 h-5 mr-3" />
                          Reports
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/investments" className="flex items-center py-2 text-gray-700 hover:text-primary">
                          <Briefcase className="w-5 h-5 mr-3" />
                          Investments
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/settings" className="flex items-center py-2 text-gray-700 hover:text-primary">
                          <Settings className="w-5 h-5 mr-3" />
                          Settings
                        </Link>
                      </SheetClose>
                    </div>
                  </SignedIn>

                  <SignedOut>
                    <div className="flex flex-col space-y-3">
                      <SheetClose asChild>
                        <a href="#features" className="flex items-center py-2 text-gray-700 hover:text-primary">
                          Features
                        </a>
                      </SheetClose>
                      <SheetClose asChild>
                        <a href="#pricing" className="flex items-center py-2 text-gray-700 hover:text-primary">
                          Pricing
                        </a>
                      </SheetClose>
                      <SheetClose asChild>
                        <a href="#testimonials" className="flex items-center py-2 text-gray-700 hover:text-primary">
                          Testimonials
                        </a>
                      </SheetClose>
                    </div>
                  </SignedOut>
                </div>

                <div className="pt-4 border-t">
                  <SignedIn>
                    <SheetClose asChild>
                      <Link href="/transaction/create">
                        <Button className="w-full mb-3">
                          <PenBox size={16} className="mr-2" />
                          Add Transaction
                        </Button>
                      </Link>
                    </SheetClose>
                  </SignedIn>

                  <SignedOut>
                    <div className="flex flex-col space-y-2">
                      <SignInButton forceRedirectUrl="/dashboard">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </SignInButton>
                      <SignInButton forceRedirectUrl="/dashboard">
                        <Button className="w-full">Sign Up</Button>
                      </SignInButton>
                    </div>
                  </SignedOut>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

export default Header

