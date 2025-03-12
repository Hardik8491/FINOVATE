"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    BarChart,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    FileText,
    Home,
    Shell,
    StickyNote,
    Wallet,
    Receipt,
    PieChart,
} from "lucide-react";

interface NavItemProps {
    href: string;
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    submenu?: boolean;
    subItems?: { href: string; label: string }[];
    openSubmenu: string | null;
    toggleSubmenu: (label: string) => void;
    pathname: string;
}

const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/accounts", icon: Wallet, label: "Accounts" },
    {
        href: "#",
        icon: CreditCard,
        label: "Cards",
        submenu: true,
        subItems: [
            { href: "/cards/physical", label: "Physical Cards" },
            { href: "/cards/virtual", label: "Virtual Cards" },
            { href: "/cards/manage", label: "Manage Cards" },
        ],
    },
    {
        href: "#",
        icon: Receipt,
        label: "Transactions",
        submenu: true,
        subItems: [
            { href: "/transactions/recent", label: "Recent" },
            { href: "/transactions/pending", label: "Pending" },
            { href: "/transactions/history", label: "History" },
        ],
    },
    { href: "/payments", icon: FileText, label: "Payment" },
    { href: "/invoicing", icon: StickyNote, label: "Invoicing" },
    { href: "/trading", icon: BarChart, label: "Trading" },
    {
        href: "#",
        icon: PieChart,
        label: "Reports",
        submenu: true,
        subItems: [
            { href: "/reports/monthly", label: "Monthly" },
            { href: "/reports/quarterly", label: "Quarterly" },
            { href: "/reports/annual", label: "Annual" },
            { href: "/reports/custom", label: "Custom" },
        ],
    },
];

function NavItem({
    href,
    icon: Icon,
    label,
    isActive,
    submenu,
    subItems = [],
    openSubmenu,
    toggleSubmenu,
    pathname,
}: NavItemProps) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const isSubmenuOpen = openSubmenu === label;
    const hasSubmenu = submenu && subItems.length > 0;

    return (
        <SidebarMenuItem>
            {hasSubmenu ? (
                <>
                    <SidebarMenuButton
                        tooltip={isCollapsed ? label : undefined}
                        onClick={() => toggleSubmenu(label)}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full",
                            isCollapsed ? "justify-center" : "",
                            isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                    >
                        <Icon
                            size={20}
                            className={isActive ? "text-primary" : ""}
                        />
                        {!isCollapsed && (
                            <>
                                <span className='flex-1'>{label}</span>
                                <ChevronDown
                                    size={16}
                                    className={
                                        isSubmenuOpen
                                            ? "rotate-180 transition-transform"
                                            : "transition-transform"
                                    }
                                />
                            </>
                        )}
                    </SidebarMenuButton>

                    {!isCollapsed && isSubmenuOpen && (
                        <SidebarMenuSub>
                            {subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.href}>
                                    <SidebarMenuSubButton
                                        asChild
                                        isActive={subItem.href === pathname}
                                    >
                                        <Link href={subItem.href}>
                                            {subItem.label}
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    )}
                </>
            ) : (
                <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={isCollapsed ? label : undefined}
                >
                    <Link
                        href={href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                            isCollapsed ? "justify-center" : "",
                            isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        )}
                    >
                        <Icon
                            size={20}
                            className={isActive ? "text-primary" : ""}
                        />
                        {!isCollapsed && <span>{label}</span>}
                    </Link>
                </SidebarMenuButton>
            )}
        </SidebarMenuItem>
    );
}

export function AppSidebar() {
    const pathname = usePathname();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const toggleSubmenu = (label: string) => {
        setOpenSubmenu(openSubmenu === label ? null : label);
    };

    return (
        <Sidebar
            collapsible='icon'
            className='min-h-screen border-r border-border bg-background/75 shadow-sm'
        >
            <SidebarHeader className='flex items-center p-4 border-b'>
                <Link href='/' className='flex items-center w-full space-x-2'>
                    <Shell className='h-7 w-7 text-primary' />
                    {!isCollapsed && (
                        <h2 className='text-xl font-semibold text-primary'>
                            FiOVATE
                        </h2>
                    )}
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className='p-2 space-y-1'>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.label}
                            {...item}
                            isActive={pathname === item.href}
                            openSubmenu={openSubmenu}
                            toggleSubmenu={toggleSubmenu}
                            pathname={pathname}
                        />
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarTrigger className='absolute top-1/2 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm transition-all -translate-y-1/2'>
                {isCollapsed ? (
                    <ChevronRight size={14} />
                ) : (
                    <ChevronLeft size={14} />
                )}
            </SidebarTrigger>
            <SidebarRail />
        </Sidebar>
    );
}
