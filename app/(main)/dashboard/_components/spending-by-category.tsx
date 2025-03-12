import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";

// Define the transaction type
type Transaction = {
    id: string;
    amount: number;
    type: string;
    category?: string;
    date: string;
    description: string;
    accountId: string;
};

// Define props
interface SpendingByCategoryProps {
    transactions: Transaction[];
}

export function SpendingByCategory({ transactions }: SpendingByCategoryProps) {
    // Group transactions by category and sum amounts
    const categoryMap = transactions.reduce((acc, transaction) => {
        const category = transaction.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += Math.abs(transaction.amount);
        return acc;
    }, {} as Record<string, number>);

    // Convert to array for chart
    const data = Object.entries(categoryMap).map(([name, value]) => ({
        name,
        value,
    }));

    // Sort by value (highest first)
    data.sort((a, b) => b.value - a.value);

    // Take top 5 categories and group the rest as "Other"
    const topCategories = data.slice(0, 5);
    const otherCategories = data.slice(5);

    const chartData =
        otherCategories.length > 0
            ? [
                  ...topCategories,
                  {
                      name: "Other",
                      value: otherCategories.reduce(
                          (sum, item) => sum + item.value,
                          0
                      ),
                  },
              ]
            : topCategories;

    // Colors for the chart
    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#A259FF",
        "#666666",
    ];

    // Format currency
    const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

    // If no data, show a message
    if (chartData.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-[200px] text-muted-foreground'>
                <p>No expense data available</p>
            </div>
        );
    }

    return (
        <div className='w-full h-[250px]'>
            <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx='50%'
                        cy='50%'
                        labelLine={false}
                        outerRadius={80}
                        fill='#8884d8'
                        dataKey='value'
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
