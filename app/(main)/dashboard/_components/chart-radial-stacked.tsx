"use client";

import { useState, useEffect } from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

// Define the data structure for spending categories
interface SpendingCategory {
    name: string;
    value: number;
    fill: string;
}

interface ChartDataItem {
    name: string;
    categories: SpendingCategory[];
    availableAmount: number;
    totalLimit: number;
}

// Sample data - replace with your real-time data source
const getInitialData = (): ChartDataItem => ({
    name: "spending",
    categories: [
        { name: "Operations", value: 1260, fill: "#8b5cf6" },
        { name: "Financing", value: 850, fill: "#f59e0b" },
        { name: "Investments", value: 450, fill: "#10b981" },
    ],
    availableAmount: 45690,
    totalLimit: 150000,
});

// Create chart config with dynamic categories
const createChartConfig = (categories: SpendingCategory[]): ChartConfig => {
    const config: Record<string, { label: string; color: string }> = {};

    categories.forEach((category) => {
        config[category.name.toLowerCase()] = {
            label: category.name,
            color: category.fill,
        };
    });

    // Add available category
    config["available"] = {
        label: "Available",
        color: "#e5e7eb",
    };

    return config as ChartConfig;
};
interface data {
    name: string;
}
export function BiggetCharts() {
    const [chartData, setChartData] = useState<ChartDataItem>(getInitialData());
    const [formattedData, setFormattedData] = useState<data[]>([]);

    // Format data for RadialBarChart
    useEffect(() => {
        const data = [
            {
                name: chartData.name,
                ...chartData.categories.reduce(
                    (acc, category) => {
                        acc[category.name.toLowerCase()] = category.value;
                        return acc;
                    },
                    {} as Record<string, number>
                ),
            },
        ];

        setFormattedData(data);
    }, [chartData]);

    // Calculate total spent and percentage
    // const totalSpent = chartData.categories.reduce(
    //     (sum, cat) => sum + cat.value,
    //     0
    // );
    // const spentPercentage = Math.round(
    //     (totalSpent / chartData.totalLimit) * 100
    // );
    const availableAmount = chartData.availableAmount.toLocaleString();

    // Create dynamic chart config
    const chartConfig = createChartConfig(chartData.categories);

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            // In a real app, you would fetch data from an API here
            // This is just a simulation of changing data
            const newData = { ...chartData };
            newData.categories = newData.categories.map((cat) => ({
                ...cat,
                value: cat.value + Math.floor(Math.random() * 20 - 10), // Random fluctuation
            }));

            setChartData(newData);
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, [chartData]);

    return (
        <div className='w-full'>
            <ChartContainer
                config={chartConfig}
                className='mx-auto aspect-square max-w-[250px] w-full'
            >
                <RadialBarChart
                    data={formattedData}
                    endAngle={180}
                    innerRadius={80}
                    outerRadius={130}
                    barSize={20}
                >
                    <ChartTooltip
                        cursor={false}
                        content={
                            <ChartTooltipContent
                                hideLabel
                                formatter={(value, name) => [
                                    `$${value.toLocaleString()}`,
                                    name,
                                ]}
                            />
                        }
                    />
                    <PolarRadiusAxis
                        tick={false}
                        tickLine={false}
                        axisLine={false}
                    >
                        <Label
                            content={({ viewBox }) => {
                                if (
                                    viewBox &&
                                    "cx" in viewBox &&
                                    "cy" in viewBox
                                ) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor='middle'
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) - 16}
                                                className='fill-foreground text-2xl font-bold'
                                            >
                                                ${availableAmount}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 4}
                                                className='fill-muted-foreground'
                                            >
                                                Available
                                            </tspan>
                                        </text>
                                    );
                                }
                            }}
                        />
                    </PolarRadiusAxis>

                    {/* Dynamically render RadialBar components for each category */}
                    {chartData.categories.map((category) => (
                        <RadialBar
                            key={category.name}
                            dataKey={category.name.toLowerCase()}
                            stackId='a'
                            cornerRadius={5}
                            fill={category.fill}
                            className='stroke-transparent stroke-2'
                        />
                    ))}
                </RadialBarChart>
            </ChartContainer>
        </div>
    );
}
