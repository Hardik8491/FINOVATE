"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [{ month: "january", desktop: 1260, mobile: 570 }];

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
    mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function BiggetCharts() {
    const totalVisitors = "45,6940";

    return (
        <div className='  w-full'>
            <ChartContainer
                config={chartConfig}
                className='mx-auto aspect-square max-w-[250px] w-full   '
            >
                <RadialBarChart
                    data={chartData}
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
                                                {totalVisitors.toLocaleString()}
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
                    <RadialBar
                        dataKey='desktop'
                        stackId='a'
                        cornerRadius={5}
                        fill='var(--color-desktop)'
                        className='stroke-transparent stroke-2'
                    />

                    <RadialBar
                        dataKey='mobile'
                        fill='var(--color-mobile)'
                        stackId='a'
                        cornerRadius={5}
                        className='stroke-transparent stroke-2'
                    />
                </RadialBarChart>
            </ChartContainer>
        </div>
    );
}
