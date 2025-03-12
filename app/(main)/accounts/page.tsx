//TODO:ADD TYPES IN ACCOUNT

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { deleteAccount } from "@/actions/account";
import { getUserAccounts } from "@/actions/dashboard";
import { AccountCard } from "../dashboard/_components/account-card";

interface Account {
    id: string;
    userId: string;
    name?: string;
    balance?: number;
    amount?: number;
    isDefault?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const AccountsPage = () => {
    const router = useRouter();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<string>("overview");

    useEffect(() => {
        let isMounted = true;

        const fetchAccounts = async () => {
            try {
                setLoading(true);
                const accounts = await getUserAccounts();
                if (isMounted) setAccounts(accounts);
            } catch (error) {
                console.log(error);

                toast.error("Failed to fetch accounts.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAccounts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this account?")) return;

        try {
            const res = await deleteAccount(id);
            if (res && res.success) {
                setAccounts((prev) =>
                    prev.filter((account) => account.id !== id)
                );
                toast.success("Account deleted successfully!");
            } else {
                toast.error("Failed to delete account.");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong.");
        }
    };

    const filteredAccounts = () => {
        if (tab === "savings")
            return accounts.filter((acc) => acc?.type === "SAVINGS");
        if (tab === "checking")
            return accounts.filter((acc) => acc?.type === "CURRENT");
        return accounts;
    };

    return (
        <div className='max-w-6xl mx-auto mt-10 p-6'>
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-semibold'>Accounts</h2>
                <Button
                    onClick={() => router.push("/accounts/new")}
                    variant='outline'
                >
                    <Plus className='w-5 h-5 mr-2' /> Add Account
                </Button>
            </div>

            <Tabs value={tab} className='w-full'>
                <TabsList className='flex justify-center space-x-4 mb-6'>
                    <TabsTrigger
                        value='overview'
                        onClick={() => setTab("overview")}
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value='savings'
                        onClick={() => setTab("savings")}
                    >
                        Savings
                    </TabsTrigger>
                    <TabsTrigger
                        value='checking'
                        onClick={() => setTab("checking")}
                    >
                        Checking
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={tab}>
                    {loading ? (
                        <p className='text-center'>Loading accounts...</p>
                    ) : filteredAccounts().length === 0 ? (
                        <p className='text-center text-gray-500'>
                            No accounts found.
                        </p>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {filteredAccounts().map((account) => (
                                <AccountCard
                                    key={account.id}
                                    account={account}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AccountsPage;
