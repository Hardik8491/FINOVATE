"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFA"];

const tempAnalytics = {
    totalIncome: 12500,
    totalExpense: 8500,
    netBalance: 4000,
    totalTransactions: 20,
    categoryBreakdown: [
        { category: "Food", value: 2500 },
        { category: "Rent", value: 3000 },
        { category: "Transport", value: 1000 },
        { category: "Entertainment", value: 1200 },
        { category: "Shopping", value: 800 },
    ],
    monthlyTrends: [
        { month: "Jan", income: 2000, expense: 1500 },
        { month: "Feb", income: 2200, expense: 1800 },
        { month: "Mar", income: 2500, expense: 2000 },
        { month: "Apr", income: 2700, expense: 2300 },
        { month: "May", income: 3100, expense: 2600 },
    ],
    transactions: [
        {
            id: 1,
            category: "Rent",
            amount: 3000,
            date: "2025-03-01",
            type: "Expense",
        },
        {
            id: 2,
            category: "Salary",
            amount: 5000,
            date: "2025-03-05",
            type: "Income",
        },
        {
            id: 3,
            category: "Groceries",
            amount: 800,
            date: "2025-03-10",
            type: "Expense",
        },
        {
            id: 4,
            category: "Freelance",
            amount: 2000,
            date: "2025-03-15",
            type: "Income",
        },
        {
            id: 5,
            category: "Entertainment",
            amount: 400,
            date: "2025-03-20",
            type: "Expense",
        },
    ],
};

const AnalyticsPage = () => {
    const [analytics] = useState(tempAnalytics);

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6'>
            {[
                {
                    title: "Total Income",
                    value: analytics.totalIncome,
                    color: "text-green-500",
                },
                {
                    title: "Total Expenses",
                    value: analytics.totalExpense,
                    color: "text-red-500",
                },
                {
                    title: "Net Balance",
                    value: analytics.netBalance,
                    color: "text-blue-500",
                },
                {
                    title: "Total Transactions",
                    value: analytics.totalTransactions,
                    color: "text-gray-700",
                },
            ].map(({ title, value, color }, idx) => (
                <Card key={idx} className='shadow-lg rounded-xl p-4 bg-white'>
                    <CardHeader>
                        <CardTitle className='text-lg font-semibold text-gray-700'>
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={`text-2xl font-bold ${color}`}>
                        ${value}
                    </CardContent>
                </Card>
            ))}

            <Card className='col-span-1 md:col-span-2 shadow-lg rounded-xl p-4 bg-white'>
                <CardHeader>
                    <CardTitle>Monthly Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <LineChart
                        width={600}
                        height={300}
                        data={analytics.monthlyTrends}
                    >
                        <XAxis dataKey='month' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type='monotone'
                            dataKey='income'
                            stroke='#0088FE'
                            strokeWidth={2}
                        />
                        <Line
                            type='monotone'
                            dataKey='expense'
                            stroke='#FF8042'
                            strokeWidth={2}
                        />
                    </LineChart>
                </CardContent>
            </Card>

            <Card className='col-span-1 md:col-span-2 shadow-lg rounded-xl p-4 bg-white'>
                <CardHeader>
                    <CardTitle>Spending Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <PieChart width={400} height={300}>
                        <Pie
                            data={analytics.categoryBreakdown}
                            dataKey='value'
                            nameKey='category'
                            cx='50%'
                            cy='50%'
                            outerRadius={100}
                            label
                        >
                            {analytics.categoryBreakdown.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </CardContent>
            </Card>

            <Card className='col-span-1 md:col-span-3 lg:col-span-4 shadow-lg rounded-xl p-4 bg-white'>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analytics.transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell>{tx.date}</TableCell>
                                    <TableCell>{tx.category}</TableCell>
                                    <TableCell
                                        className={
                                            tx.type === "Income"
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }
                                    >
                                        {tx.type}
                                    </TableCell>
                                    <TableCell>${tx.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className='col-span-1 md:col-span-3 text-center mt-4'>
                <Button
                    className='bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700'
                    onClick={() => alert("Exporting Data...")}
                >
                    Export to CSV/PDF
                </Button>
            </div>
        </div>
    );
};

export default AnalyticsPage;
