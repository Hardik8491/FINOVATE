import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

const MainLayout = ({ children }) => {
    return (
        <div className='container mx-auto my-20'>
            {children}
        </div>
    );
};

export default MainLayout;
