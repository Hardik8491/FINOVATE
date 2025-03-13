"use client";
import Link from "next/link";
import { Home, FileText, BarChart, StickyNote, Users, SettingsIcon, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

const navItems = [
  { href: "/app", icon: Home, label: "Dashboard" },
  { href: "/app/journal", icon: FileText, label: "Journal" },
  { href: "/app/analytics", icon: BarChart, label: "Analytics" },
  { href: "/app/notes", icon: StickyNote, label: "Notes" },
  { href: "/app/socials", icon: Users, label: "Social Network" },
];
const footerItems = [
  { href: "/settings", icon: SettingsIcon, label: "Settings" },
  { href: "/profile", icon: User, label: "Profile" },
];



function NavItem({ href, icon: Icon, label, isActive = false }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenuItem>
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
              ? "bg-accent/10 text-primary border-primary border-r-2"
              : "text-muted-foreground  hover:bg-accent/50"
          )}
        >
          <Icon size={20} className={cn(isActive ? "text-primary" : "")} />
          {!isCollapsed && <span className="font-medium">{label}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="h-screen text-black border-r bg-black/30 backdrop-blur-md border-white/10"
    >
      <SidebarHeader className="flex items-center gap-2 p-4 bg-transparent border-b border-white/10">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            className="w-6 h-6 text-white"
            width={20}
            height={20}
          />
        </div>
        {!isCollapsed && (
          <div className="flex items-center justify-center">
            <Image
              src="/images/textLogo.svg"
              alt="Pepe Logo"
              width={20}
              height={20}
              quality={100}
              className="w-14 h-14"
            />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="p-2 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/10">
        <SidebarMenu className="space-y-1">
          {footerItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarTrigger
        onClick={toggleSidebar}
        className={cn(
          "absolute top-8 -right-4 w-6 h-10 z-50 flex items-center justify-center bg-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/20 rounded-r-md transition-all",
          isCollapsed
            ? "-translate-y-1/2"
            : "-translate-y-1/2 translate-x-1 text-primary"
        )}
      >
        {/* {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />} */}
      </SidebarTrigger>

      <SidebarRail />
    </Sidebar>
  );
}
