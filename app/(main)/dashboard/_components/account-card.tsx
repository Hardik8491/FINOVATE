"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    CreditCard,
    MoreHorizontal,
    TrendingDown,
    TrendingUp,
    Wallet,
    ArrowUpRight,
    AlertCircle,
    Edit3,
    Star,
    Trash2,
    FileText,
    ArrowRight,
    RefreshCw,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { deleteAccount, updateDefaultAccount } from "@/actions/account";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface AccountCardProps {
    account: {
        id: string;
        name: string;
        type: string;
        balance: number;
        isDefault: boolean;
        updatedAt?: string;
    };
}

export function AccountCard({ account }: AccountCardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Get color scheme based on account type
    const getAccountStyle = (type: string) => {
        switch (type?.toLowerCase()) {
            case "checking":
                return {
                    icon: <CreditCard className='w-5 h-5' />,
                    color: "bg-blue-100 text-blue-600",
                    borderColor: "border-blue-200 hover:border-blue-300",
                };
            case "savings":
                return {
                    icon: <TrendingUp className='w-5 h-5' />,
                    color: "bg-emerald-100 text-emerald-600",
                    borderColor: "border-emerald-200 hover:border-emerald-300",
                };
            case "credit":
                return {
                    icon: <TrendingDown className='w-5 h-5' />,
                    color: "bg-amber-100 text-amber-600",
                    borderColor: "border-amber-200 hover:border-amber-300",
                };
            default:
                return {
                    icon: <Wallet className='w-5 h-5' />,
                    color: "bg-purple-100 text-purple-600",
                    borderColor: "border-purple-200 hover:border-purple-300",
                };
        }
    };

    const accountStyle = getAccountStyle(account.type);

    // Simulate refreshing account data
    const refreshAccountData = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            toast.success("Account data refreshed");
        }, 1500);
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        try {
            setIsLoading(true);
            const result = await deleteAccount(account.id);

            if (result) {
                toast.success("Account successfully deleted!");
                router.refresh(); // Refresh the page to update the UI
            }
        } catch (error) {
            toast.error("Failed to delete account. Please try again.");
            console.error("Delete error:", error);
        } finally {
            setIsLoading(false);
            setConfirmDelete(false);
        }
    };

    // Set account as default
    const setAsDefault = async () => {
        try {
            setIsLoading(true);
            const result = await updateDefaultAccount(account.id);

            if (result) {
                toast.success(`${account.name} is now your default account`);
                router.refresh(); // Refresh the page to update the UI
            }
        } catch (error) {
            toast.error("Failed to set as default. Please try again.");
            console.error("Default setting error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Format balance for display with proper commas and decimal places
    const formattedBalance = account.balance.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // Format last updated date
    const lastUpdated = account.updatedAt
        ? new Date(account.updatedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : new Date().toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
          });

    if (isLoading) {
        return <AccountCardSkeleton />;
    }

    return (
        <>
            <Card
                className={`overflow-hidden w-full transition-all hover:shadow-md ${
                    account.isDefault
                        ? "border-primary"
                        : accountStyle.borderColor
                }`}
            >
                <CardHeader className='flex flex-row items-start justify-between pb-2 space-y-0'>
                    <div className='flex flex-col'>
                        <div className='flex items-center space-x-2'>
                            <div
                                className={`p-2 rounded-full ${accountStyle.color}`}
                            >
                                {accountStyle.icon}
                            </div>
                            <div>
                                <CardTitle className='text-base font-semibold'>
                                    {account.name}
                                </CardTitle>
                                <CardDescription className='mt-0.5 flex items-center'>
                                    <span className='capitalize text-xs'>
                                        {account.type}
                                    </span>
                                    {account.isDefault && (
                                        <Badge
                                            variant='secondary'
                                            className='ml-2 text-xs px-1.5 py-0'
                                        >
                                            Default
                                        </Badge>
                                    )}
                                </CardDescription>
                            </div>
                        </div>
                        <div className='mt-1 text-xs text-muted-foreground flex items-center'>
                            <span className='font-mono'>#{account.id}</span>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant='ghost'
                                size='icon'
                                className='w-8 h-8 rounded-full hover:bg-muted'
                            >
                                <MoreHorizontal className='w-4 h-4' />
                                <span className='sr-only'>Account options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-56'>
                            <DropdownMenuLabel>
                                Account Options
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() =>
                                    router.push(`account/${account.id}`)
                                }
                            >
                                <FileText className='w-4 h-4 mr-2' />
                                View Account Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => refreshAccountData()}
                            >
                                <RefreshCw className='w-4 h-4 mr-2' />
                                Refresh Account Data
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.push(`account/${account.id}/setting`)
                                }
                            >
                                <Edit3 className='w-4 h-4 mr-2' />
                                Edit Account Settings
                            </DropdownMenuItem>
                            {!account.isDefault && (
                                <DropdownMenuItem onClick={setAsDefault}>
                                    <Star className='w-4 h-4 mr-2' />
                                    Set as Default Account
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className='text-destructive focus:text-destructive'
                                onClick={() => setConfirmDelete(true)}
                            >
                                <Trash2 className='w-4 h-4 mr-2' />
                                Remove Account
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>

                <CardContent className='pt-2'>
                    <div className='flex flex-col'>
                        <div className='flex items-baseline gap-1'>
                            <span className='text-2xl font-bold'>
                                ${formattedBalance}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                                USD
                            </span>
                        </div>
                        <div className='mt-1 flex items-center text-xs text-muted-foreground'>
                            <RefreshCw
                                className={`w-3 h-3 mr-1 ${
                                    isRefreshing ? "animate-spin" : ""
                                }`}
                            />
                            Last updated: {lastUpdated}
                        </div>
                    </div>

                    {/* Account activity overview */}
                    <div className='mt-4 pt-4 border-t border-border'>
                        <div className='flex items-center justify-between text-sm'>
                            <span className='text-muted-foreground'>
                                Recent Activity
                            </span>
                            <span className='text-right font-medium flex items-center gap-1'>
                                <ArrowUpRight className='w-3.5 h-3.5 text-emerald-500' />
                                +$120.50
                            </span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className='flex justify-between px-4 py-3 bg-muted/30 border-t'>
                    <Button
                        variant='outline'
                        size='sm'
                        className='text-xs h-8'
                        onClick={() =>
                            router.push(`/account/${account.id}/transactions`)
                        }
                    >
                        Transactions
                        <FileText className='w-3.5 h-3.5 ml-1 opacity-70' />
                    </Button>
                    <Button
                        variant='default'
                        size='sm'
                        className='text-xs h-8'
                        onClick={() => router.push(`/account/${account.id}`)}
                    >
                        View Account
                        <ArrowRight className='w-3.5 h-3.5 ml-1' />
                    </Button>
                </CardFooter>
            </Card>

            {/* Delete confirmation dialog */}
            <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='flex items-center gap-2'>
                            <AlertCircle className='h-5 w-5 text-destructive' />
                            Delete Account
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete{" "}
                            <strong>{account.name}</strong>? This action cannot
                            be undone. All transaction history associated with
                            this account will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                            onClick={handleDeleteAccount}
                        >
                            Delete Account
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

// Skeleton loader for the account card
function AccountCardSkeleton() {
    return (
        <Card className='overflow-hidden'>
            <CardHeader className='flex flex-row items-start justify-between pb-2 space-y-0'>
                <div className='flex items-center space-x-2'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div>
                        <Skeleton className='h-5 w-32' />
                        <Skeleton className='h-4 w-20 mt-1' />
                    </div>
                </div>
                <Skeleton className='h-8 w-8 rounded-full' />
            </CardHeader>
            <CardContent>
                <Skeleton className='h-8 w-40' />
                <Skeleton className='h-3 w-32 mt-2' />
                <div className='mt-4 pt-4 border-t border-border'>
                    <div className='flex items-center justify-between'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-4 w-16' />
                    </div>
                </div>
            </CardContent>
            <CardFooter className='flex justify-between px-4 py-3 bg-muted/30 border-t'>
                <Skeleton className='h-8 w-28' />
                <Skeleton className='h-8 w-28' />
            </CardFooter>
        </Card>
    );
}
