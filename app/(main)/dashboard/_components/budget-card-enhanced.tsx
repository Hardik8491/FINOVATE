"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EditLimitsDialog } from "./edit-limits-dialog";
import { BiggetCharts } from "./chart-radial-stacked";

// Define the category type
interface Category {
    name: string;
    limit: number;
    spent: number;
    color: string;
}

// Define budget prop type
interface BudgetCardProps {
    budget?: {
        categories: Category[];
        totalLimit: number;
        renewalDate: string;
    };
}

export function BudgetCard({ budget }: BudgetCardProps) {
    console.log(budget);

    // Initial budget data
    const [categories, setCategories] = useState<Category[]>([
        { name: "Operations", limit: 5000, spent: 2700, color: "#8b5cf6" },
        {
            name: "Financing Activities",
            limit: 3000,
            spent: 1050,
            color: "#f59e0b",
        },
        { name: "Investments", limit: 2000, spent: 600, color: "#10b981" },
    ]);

    const [totalLimit, setTotalLimit] = useState<number>(10000);
    const [renewalDate] = useState<string>("May 1, 2024");

    // Calculate total spent and percentage
    const totalSpent: number = categories.reduce(
        (sum, cat) => sum + cat.spent,
        0
    );
    const spentPercentage: number = Math.round((totalSpent / totalLimit) * 100);

    // // Calculate available amount
    // const availableAmount: number = totalLimit - totalSpent;

    // Handle saving updated limits
    const handleSaveLimits = (
        newCategories: Category[],
        newTotalLimit: number
    ) => {
        setCategories(newCategories);
        setTotalLimit(newTotalLimit);
    };

    return (
        <Card>
            <CardContent className='p-4'>
                <div className='flex flex-col md:flex-row justify-between items-center gap-6 p-4 border rounded-3xl w-full'>
                    {/* Left Section */}
                    <div className='flex flex-col items-start gap-3 w-full md:w-1/2'>
                        <div className='text-xl font-semibold text-gray-500'>
                            Spending Limit
                        </div>
                        <span className='text-3xl font-bold'>
                            {spentPercentage}%
                        </span>
                        <div className='text-md text-gray-500'>
                            Limit renews on {renewalDate}
                        </div>
                        <EditLimitsDialog
                            initialCategories={categories}
                            totalLimit={totalLimit}
                            onSave={handleSaveLimits}
                        />
                    </div>

                    {/* Right Section */}
                    <div className='flex relative flex-col items-center w-full md:w-1/2'>
                        <BiggetCharts />

                        {/* Legend Section */}
                        <div className='flex top-28 absolute flex-col gap-2 mt-4 w-full'>
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className='flex items-center gap-2 text-sm w-full justify-between'
                                >
                                    <div className='flex items-center gap-2'>
                                        <div
                                            className='w-3 h-3 rounded-full'
                                            style={{
                                                backgroundColor: category.color,
                                            }}
                                        ></div>
                                        <span>{category.name}</span>
                                    </div>
                                    <span className='font-medium'>
                                        {totalSpent > 0
                                            ? Math.round(
                                                  (category.spent /
                                                      totalSpent) *
                                                      100
                                              )
                                            : 0}
                                        %
                                    </span>
                                </div>
                            ))}
                            <div className='flex items-center gap-2 text-sm w-full justify-between'>
                                <div className='flex items-center gap-2'>
                                    <div
                                        className='w-3 h-3 rounded-full'
                                        style={{ backgroundColor: "#e5e7eb" }}
                                    ></div>
                                    <span>Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
