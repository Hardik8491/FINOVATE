import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="z-[999] w-full text-white bg-gray-900">
            <div className="container px-4 py-12 mx-auto">
                {/* Main footer content */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Company info */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Finovate</h2>
                        <p className="max-w-xs text-gray-400">
                            Empowering your financial future with innovative solutions that drive growth and prosperity.
                        </p>
                        <div className="flex pt-2 space-x-4">
                            <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                <Facebook size={20} />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                <Twitter size={20} />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                <Linkedin size={20} />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                <Instagram size={20} />
                                <span className="sr-only">Instagram</span>
                            </Link>
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Legal</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-400 transition-colors hover:text-white">
                                    Disclaimer
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="mr-2 h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                                <span className="text-gray-400">
                                    123 Financial District, Suite 100
                                    <br />
                                    New York, NY 10001
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-gray-400" />
                                <span className="text-gray-400">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 mr-2 text-gray-400" />
                                <span className="text-gray-400">contact@finovate.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8 bg-gray-800" />

                {/* Bottom footer */}
                <div className="flex flex-col items-center justify-between text-sm text-gray-400 md:flex-row">
                    <p>&copy; {new Date().getFullYear()} Finovate. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">
                        Designed with <span className="text-red-500">♥</span> by{" "}
                        <span className="font-medium text-white">Hardik Bhammar</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

