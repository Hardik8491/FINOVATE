"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftRight } from "lucide-react";

interface Category {
    name: string;
    limit: number;
    color: string;
}

interface EditLimitsDialogProps {
    initialCategories: Category[];
    totalLimit: number;
    onSave: (categories: Category[], totalLimit: number) => void;
    children?: React.ReactNode;
}

export function EditLimitsDialog({
    initialCategories,
    totalLimit,
    onSave,
    children,
}: EditLimitsDialogProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [newTotalLimit, setNewTotalLimit] = useState<number>(totalLimit);
    const [open, setOpen] = useState(false);

    const handleCategoryLimitChange = (index: number, value: string) => {
        const newCategories = [...categories];
        newCategories[index].limit = Number(value) || 0;
        setCategories(newCategories);
    };

    const handleSave = () => {
        onSave(categories, newTotalLimit);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button
                        variant='outline'
                        className='flex items-center justify-center'
                        size='lg'
                    >
                        <span>Edit Limits</span>
                        <span className='ml-2'>
                            <ArrowLeftRight className='h-4 w-4' />
                        </span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Edit Spending Limits</DialogTitle>
                    <DialogDescription>
                        Adjust your total spending limit and category
                        allocations.
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='totalLimit' className='text-right'>
                            Total Limit
                        </Label>
                        <Input
                            id='totalLimit'
                            type='number'
                            value={newTotalLimit}
                            onChange={(e) =>
                                setNewTotalLimit(Number(e.target.value) || 0)
                            }
                            className='col-span-3'
                        />
                    </div>
                    <div className='my-2 border-t pt-4'>
                        <h4 className='mb-3 font-medium'>Category Limits</h4>
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className='grid grid-cols-4 items-center gap-4 mb-3'
                            >
                                <div className='flex items-center gap-2'>
                                    <div
                                        className='w-3 h-3 rounded-full'
                                        style={{
                                            backgroundColor: category.color,
                                        }}
                                    ></div>
                                    <Label
                                        htmlFor={`category-${index}`}
                                        className='text-right'
                                    >
                                        {category.name}
                                    </Label>
                                </div>
                                <Input
                                    id={`category-${index}`}
                                    type='number'
                                    value={category.limit}
                                    onChange={(e) =>
                                        handleCategoryLimitChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    className='col-span-3'
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button type='submit' onClick={handleSave}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
