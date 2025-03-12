"use client";

import { updateAccountSettings } from "@/actions/account";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Account {
    id: string;
    name: string;
    type: string;
    status: string;
    currency: string;
    interestRate?: string;
    goalAmount?: string;
    linkedAccounts?: string;
}

interface SettingProps {
    account: Account;
}

const Setting: React.FC<SettingProps> = ({ account }) => {
    const router = useRouter();
    const [name, setName] = useState(account?.name || "");
    const [type, setType] = useState(account?.type || "");
    const [status, setStatus] = useState(account?.status || "");
    const [currency, setCurrency] = useState(account?.currency || "USD");
    const [interestRate, setInterestRate] = useState(
        account?.interestRate || ""
    );
    const [goalAmount, setGoalAmount] = useState(account?.goalAmount || "");
    const [linkedAccounts, setLinkedAccounts] = useState(
        account?.linkedAccounts || ""
    );
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        try {
            setIsLoading(true);
            const result = await updateAccountSettings(account.id, {
                name,
                type,
                status,
                currency,
                interestRate,
                goalAmount,
                linkedAccounts,
            });
            if (result) {
                toast.success("Account settings updated successfully!");
                router.refresh();
                router.back();
            }
        } catch (error) {
            toast.error("Failed to update settings. Please try again.");
            console.error("Settings update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className='max-w-2xl mx-auto mt-10 p-6 shadow-lg rounded-xl'>
            <CardHeader>
                <CardTitle className='text-xl font-semibold'>
                    Account Settings
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='grid grid-cols-1 gap-6'>
                    <div>
                        <Label htmlFor='name'>Account Name</Label>
                        <Input
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <Label>Account Type</Label>
                        <Select
                            value={type}
                            onValueChange={setType}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select Type' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='CURRENT'>Current</SelectItem>
                                <SelectItem value='SAVINGS'>Savings</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Account Status</Label>
                        <Select
                            value={status}
                            onValueChange={setStatus}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select Status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='ACTIVE'>Active</SelectItem>
                                <SelectItem value='INACTIVE'>
                                    Inactive
                                </SelectItem>
                                <SelectItem value='CLOSED'>Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Currency</Label>
                        <Select
                            value={currency}
                            onValueChange={setCurrency}
                            disabled={isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select Currency' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='USD'>USD ($)</SelectItem>
                                <SelectItem value='EUR'>EUR (€)</SelectItem>
                                <SelectItem value='INR'>INR (₹)</SelectItem>
                                <SelectItem value='GBP'>GBP (£)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {type === "SAVINGS" && (
                        <>
                            <div>
                                <Label htmlFor='interestRate'>
                                    Interest Rate (%)
                                </Label>
                                <Input
                                    id='interestRate'
                                    type='number'
                                    placeholder='Enter interest rate'
                                    value={interestRate}
                                    onChange={(e) =>
                                        setInterestRate(e.target.value)
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                            <div>
                                <Label htmlFor='goalAmount'>
                                    Savings Goal ($)
                                </Label>
                                <Input
                                    id='goalAmount'
                                    type='number'
                                    placeholder='Enter goal amount'
                                    value={goalAmount}
                                    onChange={(e) =>
                                        setGoalAmount(e.target.value)
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <Label htmlFor='linkedAccounts'>Linked Accounts</Label>
                        <Input
                            id='linkedAccounts'
                            value={linkedAccounts}
                            onChange={(e) => setLinkedAccounts(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className='w-full mt-6'
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </CardContent>
        </Card>
    );
};

export default Setting;
