"use client";

import { useState, useEffect, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";
import { z } from "zod";

// Define TypeScript types
type AccountFormData = z.infer<typeof accountSchema>;

type CreateAccountDrawerProps = {
    children: ReactNode;
};

export function CreateAccountDrawer({ children }: CreateAccountDrawerProps) {
    const [open, setOpen] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: 0,
            isDefault: false,
        },
    });

    const {
        loading: createAccountLoading,
        fn: createAccountFn,
        error,
        data: newAccount,
    } = useFetch<AccountFormData, AccountFormData>(createAccount);

    const onSubmit = async (data: AccountFormData) => {
        await createAccountFn(data);
    };

    // Reset form when a new account is created
    useEffect(() => {
        if (newAccount) {
            toast.success("Account created successfully");
            reset();
            setOpen(false);
        }
    }, [newAccount, reset]);

    // Reset form when the drawer is closed
    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    // Handle API errors
    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to create account");
        }
    }, [error]);

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Account</DrawerTitle>
                </DrawerHeader>
                <div className='px-4 pb-4'>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='space-y-4'
                    >
                        <div className='space-y-2'>
                            <label
                                htmlFor='name'
                                className='text-sm font-medium'
                            >
                                Account Name
                            </label>
                            <Input
                                id='name'
                                placeholder='e.g., Main Checking'
                                {...register("name")}
                            />
                            {errors.name && (
                                <p className='text-sm text-red-500'>
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='type'
                                className='text-sm font-medium'
                            >
                                Account Type
                            </label>
                            <Select
                                onValueChange={(value) =>
                                    setValue(
                                        "type",
                                        value as "CURRENT" | "SAVINGS"
                                    )
                                }
                                defaultValue={watch("type")}
                            >
                                <SelectTrigger id='type'>
                                    <SelectValue placeholder='Select type' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='CURRENT'>
                                        Current
                                    </SelectItem>
                                    <SelectItem value='SAVINGS'>
                                        Savings
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className='text-sm text-red-500'>
                                    {errors.type.message}
                                </p>
                            )}
                        </div>

                        <div className='space-y-2'>
                            <label
                                htmlFor='balance'
                                className='text-sm font-medium'
                            >
                                Initial Balance
                            </label>
                            <Input
                                id='balance'
                                type='number'
                                step='0.01'
                                placeholder='0.00'
                                {...register("balance", {
                                    valueAsNumber: true,
                                })}
                            />
                            {errors.balance && (
                                <p className='text-sm text-red-500'>
                                    {errors.balance.message}
                                </p>
                            )}
                        </div>

                        <div className='flex items-center justify-between rounded-lg border p-3'>
                            <div className='space-y-0.5'>
                                <label
                                    htmlFor='isDefault'
                                    className='text-base font-medium cursor-pointer'
                                >
                                    Set as Default
                                </label>
                                <p className='text-sm text-muted-foreground'>
                                    This account will be selected by default for
                                    transactions.
                                </p>
                            </div>
                            <Switch
                                id='isDefault'
                                checked={watch("isDefault")}
                                onCheckedChange={(checked) =>
                                    setValue("isDefault", checked)
                                }
                            />
                        </div>

                        <div className='flex gap-4 pt-4'>
                            <DrawerClose asChild>
                                <Button
                                    type='button'
                                    variant='outline'
                                    className='flex-1'
                                >
                                    Cancel
                                </Button>
                            </DrawerClose>
                            <Button
                                type='submit'
                                className='flex-1'
                                disabled={createAccountLoading}
                            >
                                {createAccountLoading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
