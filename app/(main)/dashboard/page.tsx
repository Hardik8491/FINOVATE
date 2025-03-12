import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import {
    ArrowDownIcon,
    ArrowLeftRight,
    ArrowUpIcon,
    BarChart3,
    DollarSign,
    Plus,
    PieChart,
    TrendingUp,
    ExternalLink,
    AlertCircle,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import Link from "next/link";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { AccountCard } from "./_components/account-card";
import { DashboardOverview } from "./_components/transaction-overview";
import { BudgetCard } from "./_components/budget-card-enhanced";
import { Badge } from "@/components/ui/badge";
import { getCurrentBudget } from "@/actions/budget";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BudgetProgress } from "./_components/budget-progress";

export default async function DashboardPage() {
    let accounts = [];
    let transactions = [];
    let budgetData = null;
    let errorMessage = null;

    try {
        [accounts, transactions] = await Promise.all([
            getUserAccounts(),
            getDashboardData(),
        ]);
    } catch (error) {
        console.error("Error fetching accounts or transactions:", error);
        errorMessage = "Failed to load account and transaction data.";
    }

    const defaultAccount = accounts?.find((account) => account.isDefault);

    // Get budget for default account
    if (defaultAccount) {
        try {
            budgetData = await getCurrentBudget(defaultAccount.id);
            console.log(budgetData);
        } catch (error) {
            console.error("Error fetching budget data:", error);
            errorMessage = "Failed to load budget data.";
        }
    }
    // const budgetData = {
    //     amount: 2000,
    //     currentExpenses: 850,
    //     categories: [
    //         { name: "Housing", allocated: 800, spent: 800, color: "#4f46e5" }, // Indigo
    //         { name: "Food", allocated: 500, spent: 350, color: "#16a34a" }, // Green
    //         {
    //             name: "Transportation",
    //             allocated: 300,
    //             spent: 220,
    //             color: "#8b5cf6",
    //         }, // Purple
    //         {
    //             name: "Entertainment",
    //             allocated: 200,
    //             spent: 180,
    //             color: "#f59e0b",
    //         }, // Amber
    //         { name: "Utilities", allocated: 200, spent: 150, color: "#ef4444" }, // Red
    //         { name: "Shopping", allocated: 150, spent: 100, color: "#06b6d4" }, // Cyan
    //         { name: "Healthcare", allocated: 100, spent: 50, color: "#ec4899" }, // Pink
    //     ],
    // };

    // Calculate total balance across all accounts
    const totalBalance = accounts.reduce(
        (sum, account) => sum + account.balance,
        0
    );

    // Get recent income and expenses from transactions
    const recentIncome = transactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

    const recentExpenses = transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // // Calculate budget progress percentage
    // const budgetProgressPercentage =
    //     (budgetData.currentExpenses / budgetData.amount) * 100;

    return (
        <div className='flex w-full min-h-screen bg-transparent'>
            <div className='flex-1 overflow-auto'>
                <Card className='p-6 space-y-6 bg-transparent'>
                    {/* Error Alert */}
                    {errorMessage && (
                        <Alert variant='destructive'>
                            <AlertCircle className='w-4 h-4' />
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}

                    {/* Summary Cards */}
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        <Card className='overflow-hidden border shadow-sm hover:shadow-md transition-all'>
                            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-primary/10 to-transparent'>
                                <CardTitle className='text-sm font-medium'>
                                    Total Balance
                                </CardTitle>
                                <div className='p-1.5 rounded-full bg-primary/10'>
                                    <DollarSign className='w-4 h-4 text-primary' />
                                </div>
                            </CardHeader>
                            <CardContent className='pt-4'>
                                <div className='text-2xl font-bold'>
                                    $
                                    {totalBalance.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </div>
                                <p className='text-xs text-muted-foreground'>
                                    Across {accounts.length} accounts
                                </p>
                            </CardContent>
                        </Card>
                        <Card className='overflow-hidden border shadow-sm hover:shadow-md transition-all'>
                            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-emerald-50 to-transparent'>
                                <CardTitle className='text-sm font-medium'>
                                    Recent Income
                                </CardTitle>
                                <div className='p-1.5 rounded-full bg-emerald-100'>
                                    <ArrowUpIcon className='w-4 h-4 text-emerald-600' />
                                </div>
                            </CardHeader>
                            <CardContent className='pt-4'>
                                <div className='text-2xl font-bold text-emerald-600'>
                                    +$
                                    {recentIncome.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </div>
                                <p className='text-xs text-muted-foreground'>
                                    Last 30 days
                                </p>
                            </CardContent>
                        </Card>
                        <Card className='overflow-hidden border shadow-sm hover:shadow-md transition-all'>
                            <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-rose-50 to-transparent'>
                                <CardTitle className='text-sm font-medium'>
                                    Recent Expenses
                                </CardTitle>
                                <div className='p-1.5 rounded-full bg-rose-100'>
                                    <ArrowDownIcon className='w-4 h-4 text-rose-600' />
                                </div>
                            </CardHeader>
                            <CardContent className='pt-4'>
                                <div className='text-2xl font-bold text-rose-600'>
                                    -$
                                    {recentExpenses.toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </div>
                                <p className='text-xs text-muted-foreground'>
                                    Last 30 days
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Budget Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Monthly Budget</CardTitle>
                            <CardDescription>
                                Track your spending against your monthly budget
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BudgetProgress
                                initialBudget={budgetData?.budget?.amount}
                                currentExpenses={
                                    budgetData?.currentExpenses || 0
                                }
                            />
                        </CardContent>
                    </Card>

                    {/* Analytics and Budget */}
                    <div className='grid gap-4 md:grid-cols-2'>
                        {/* Analytics */}
                        <Card className='overflow-hidden border shadow-sm hover:shadow-md transition-all'>
                            <CardHeader className='bg-gradient-to-r from-primary/5 to-transparent'>
                                <div className='flex items-center justify-between'>
                                    <div>
                                        <CardTitle className='flex items-center gap-2'>
                                            <PieChart className='w-5 h-5 text-primary' />
                                            Spending Analytics
                                        </CardTitle>
                                        <CardDescription>
                                            Breakdown of your spending by
                                            category
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        variant='outline'
                                        className='bg-primary/5'
                                    >
                                        Last 30 days
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className='pt-6'>
                                <div className='space-y-4'>
                                    {budgetData?.categories?.map((category) => (
                                        <div
                                            key={category.name}
                                            className='space-y-2'
                                        >
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <div
                                                        className='w-3 h-3 rounded-full'
                                                        style={{
                                                            backgroundColor:
                                                                category.color,
                                                        }}
                                                    ></div>
                                                    <span className='text-sm font-medium'>
                                                        {category.name}
                                                    </span>
                                                </div>
                                                <span className='text-sm text-muted-foreground'>
                                                    $
                                                    {category.spent.toLocaleString()}{" "}
                                                    <span className='text-xs opacity-70'>
                                                        / $
                                                        {category.allocated.toLocaleString()}
                                                    </span>
                                                </span>
                                            </div>
                                            <Progress
                                                value={
                                                    (category.spent /
                                                        category.allocated) *
                                                    100
                                                }
                                                className='h-2'
                                                indicatorStyle={{
                                                    backgroundColor:
                                                        category.color,
                                                }} // Use inline styles
                                                style={{
                                                    ["--progress-background"]:
                                                        category.color,
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className='flex justify-center pt-2 pb-6'>
                                <Link href='/transactions/analytics'>
                                    <Button
                                        variant='default'
                                        size='sm'
                                        className='gap-1.5'
                                    >
                                        <BarChart3 className='w-4 h-4' />
                                        <span>View Detailed Analytics</span>
                                        <ExternalLink className='w-3.5 h-3.5 ml-1' />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>

                        {/* Budget Progress */}
                        <>
                            <BudgetCard budget={budgetData} />
                        </>
                    </div>

                    {/* Tabs for Accounts and Transactions */}
                    <Tabs defaultValue='accounts' className='space-y-4'>
                        <TabsList className='bg-muted/50 p-1'>
                            <TabsTrigger
                                value='accounts'
                                className='data-[state=active]:bg-background'
                            >
                                Accounts
                            </TabsTrigger>
                            <TabsTrigger
                                value='transactions'
                                className='data-[state=active]:bg-background'
                            >
                                Recent Transactions
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value='accounts' className='space-y-4'>
                            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                                {defaultAccount && (
                                    <AccountCard
                                        key={defaultAccount.id}
                                        account={defaultAccount}
                                    />
                                )}
                                {accounts
                                    ?.filter((acc) => !acc.isDefault)
                                    .map((account) => (
                                        <AccountCard
                                            key={account.id}
                                            account={account}
                                        />
                                    ))}

                                <CreateAccountDrawer>
                                    <Card className='transition-all border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50'>
                                        <CardContent className='flex flex-col items-center justify-center h-full pt-6 pb-6'>
                                            <div className='p-3 mb-2 rounded-full bg-primary/10'>
                                                <Plus className='w-6 h-6 text-primary' />
                                            </div>
                                            <p className='font-medium'>
                                                Add New Account
                                            </p>
                                            <p className='mt-1 text-xs text-muted-foreground'>
                                                Connect a bank or create
                                                manually
                                            </p>
                                        </CardContent>
                                    </Card>
                                </CreateAccountDrawer>
                            </div>
                        </TabsContent>

                        <TabsContent value='transactions'>
                            <Card className='overflow-hidden border shadow-sm'>
                                <CardHeader className='bg-gradient-to-r from-muted/50 to-transparent'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <CardTitle className='flex items-center gap-2'>
                                                <ArrowLeftRight className='w-5 h-5 text-primary' />
                                                Recent Transactions
                                            </CardTitle>
                                            <CardDescription>
                                                Your recent financial activity
                                                across all accounts
                                            </CardDescription>
                                        </div>
                                        <Link href='/transactions'>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                className='gap-1.5'
                                            >
                                                <TrendingUp className='w-4 h-4' />
                                                <span>All Transactions</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <DashboardOverview
                                        accounts={accounts}
                                        transactions={transactions || []}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}
