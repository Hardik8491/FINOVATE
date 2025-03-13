import { Button } from "@/components/ui/button";
import {
    DollarSign,
    Home,
    Wallet,
    CreditCard,
    LineChart,
    Settings,
} from "lucide-react";
import React from "react";


const App_Sidebar = () => {
    return (
        <div>
            <div className='flex-col hidden w-64 min-h-full border-r md:flex bg-muted/40'>
                <div className='flex items-center px-4 border-b h-14'>
                    <span className='flex items-center text-lg font-semibold'>
                        <DollarSign className='w-5 h-5 mr-2' />
                        FinTrack
                    </span>
                </div>
                <nav className='flex-1 p-4 space-y-1'>
                    <Button
                        variant='secondary'
                        className='justify-start w-full'
                        size='sm'
                    >
                        <Home className='w-4 h-4 mr-2' />
                        Dashboard
                    </Button>
                    <Button
                        variant='ghost'
                        className='justify-start w-full'
                        size='sm'
                    >
                        <Wallet className='w-4 h-4 mr-2' />
                        Accounts
                    </Button>
                    <Button
                        variant='ghost'
                        className='justify-start w-full'
                        size='sm'
                    >
                        <CreditCard className='w-4 h-4 mr-2' />
                        Transactions
                    </Button>
                    <Button
                        variant='ghost'
                        className='justify-start w-full'
                        size='sm'
                    >
                        <LineChart className='w-4 h-4 mr-2' />
                        Analytics
                    </Button>
                    <Button
                        variant='ghost'
                        className='justify-start w-full'
                        size='sm'
                    >
                        <Settings className='w-4 h-4 mr-2' />
                        Settings
                    </Button>
                </nav>
            </div>
        </div>
    );
};

export default App_Sidebar;
