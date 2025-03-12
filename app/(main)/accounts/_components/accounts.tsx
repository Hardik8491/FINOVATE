"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Account {
    id: string;
    name: string;
    type: "SAVINGS" | "CURRENT";
    status: "ACTIVE" | "INACTIVE" | "CLOSED";
    balance: number;
    currency: string;
}

const Accounts: React.FC = () => {
    const router = useRouter();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<string>("overview");

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/accounts");
                const data: Account[] = await res.json();
                setAccounts(data);
            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch accounts.");
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this account?")) return;

        try {
            const res = await fetch(`/api/accounts/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setAccounts(accounts.filter((account) => account.id !== id));
                toast.success("Account deleted successfully!");
            } else {
                toast.error("Failed to delete account.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to fetch accounts.");
        }
    };

    const filteredAccounts = (): Account[] => {
        if (tab === "savings") {
            return accounts.filter((acc) => acc.type === "SAVINGS");
        } else if (tab === "checking") {
            return accounts.filter((acc) => acc.type === "CURRENT");
        }
        return accounts;
    };

    return (
        <div>
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

                <Tabs value={tab} onValueChange={setTab} className='w-full'>
                    <TabsList className='flex justify-center space-x-4 mb-6'>
                        <TabsTrigger value='overview'>Overview</TabsTrigger>
                        <TabsTrigger value='savings'>Savings</TabsTrigger>
                        <TabsTrigger value='checking'>Checking</TabsTrigger>
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
                                    <Card
                                        key={account.id}
                                        className='p-4 shadow-lg hover:shadow-xl transition cursor-pointer'
                                        onClick={() =>
                                            router.push(
                                                `/accounts/${account.id}`
                                            )
                                        }
                                    >
                                        <CardHeader className='flex items-center justify-between'>
                                            <CardTitle className='text-lg font-semibold'>
                                                {account.name}
                                            </CardTitle>
                                            <span
                                                className={`px-2 py-1 rounded-lg text-xs font-semibold 
                                            ${
                                                account.status === "ACTIVE"
                                                    ? "bg-green-100 text-green-700"
                                                    : account.status ===
                                                        "INACTIVE"
                                                      ? "bg-yellow-100 text-yellow-700"
                                                      : "bg-red-100 text-red-700"
                                            }`}
                                            >
                                                {account.status}
                                            </span>
                                        </CardHeader>
                                        <CardContent>
                                            <p className='text-sm text-gray-500'>
                                                Type: {account.type}
                                            </p>
                                            <p className='text-xl font-bold mt-2'>
                                                ${account.balance}
                                            </p>
                                            <p className='text-sm text-gray-400'>
                                                Currency: {account.currency}
                                            </p>

                                            <div className='flex justify-end space-x-2 mt-4'>
                                                <Button
                                                    variant='outline'
                                                    size='icon'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(
                                                            `/accounts/${account.id}/edit`
                                                        );
                                                    }}
                                                >
                                                    <Edit className='w-4 h-4' />
                                                </Button>
                                                <Button
                                                    variant='destructive'
                                                    size='icon'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(
                                                            account.id
                                                        );
                                                    }}
                                                >
                                                    <Trash className='w-4 h-4' />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Accounts;
