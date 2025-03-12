"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const budgetData = [
    {
        operations: 54,
        financing: 35,
        investments: 10,
        available: 5000,
        marketing: 20,
        research: 15,
    },
];

const generateBudgetConfig = (data) => {
    return Object.keys(data).reduce((acc, key, index) => {
        acc[key] = {
            label: key.charAt(0).toUpperCase() + key.slice(1),
            color: `hsl(var(--chart-${index + 1}))`,
        };
        return acc;
    }, {});
};

const budgetConfig = generateBudgetConfig(budgetData[0]);

const BudgetMonitor = () => {
    return (
        <Card className='flex flex-col w-[250px] h-[350px]'>
            <CardHeader className='items-center pb-0'>
                <CardTitle>Budget Monitor</CardTitle>
                <CardDescription>Track your financial status</CardDescription>
            </CardHeader>
            <CardContent className='flex   flex-1 items-center pb-0'>
                <ChartContainer
                    config={budgetConfig}
                    className='mx-auto aspect-square w-full max-w-[250px]'
                >
                    <RadialBarChart
                        data={budgetData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
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
                                                    $
                                                    {budgetData[0].available.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className='fill-muted-foreground'
                                                >
                                                    Available Balance
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        {Object.keys(budgetData[0]).map((key, index) => (
                            <RadialBar
                                key={key}
                                dataKey={key}
                                fill={`hsl(var(--chart-${index + 1}))`}
                                stackId='a'
                                cornerRadius={5}
                                className='stroke-transparent stroke-2'
                            />
                        ))}
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardContent className='mt-4'>
                <div className='flex flex-wrap items-center '>
                    {/* <div className=' grid grid-cols-2 items-center justify-between gap-2'> */}
                    {Object.keys(budgetData[0]).map((key, index) => (
                        <div key={key} className='flex items-center gap-2'>
                            <div
                                className='w-4 h-4 rounded-full'
                                style={{
                                    backgroundColor: `hsl(var(--chart-${
                                        index + 1
                                    }))`,
                                }}
                            ></div>
                            <span className='text-sm font-medium capitalize'>
                                {key}
                            </span>
                            <span className='text-sm text-muted-foreground'>
                                {budgetData[0][key]}%
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default BudgetMonitor;
