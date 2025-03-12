import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { notFound } from "next/navigation";
import { TransactionTable } from "../_components/transaction-table";
import { AccountChart } from "../_components/account-chart";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowUpDown,
    Download,
    Filter,
    Plus,
    Edit,
    CreditCard,
    LineChart,
    PiggyBank,
    ArrowDown,
    ArrowUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

type Transaction = {
    id: string;
    type: "INCOME" | "EXPENSE";
    amount: string;
};
interface AccountPageProps {
    params: { id: string };
}

export default async function AccountPage({ params }: AccountPageProps) {
    const { id } = params;
    const accountData = await getAccountWithTransactions(id);

    if (!accountData) {
        notFound();
    }

    const { transactions, ...account } = accountData;

    const income: number = transactions
        .filter((t: Transaction) => t.type === "INCOME")
        .reduce(
            (sum: number, t: Transaction) =>
                sum + Number.parseFloat(t.amount.toString()),
            0
        );

    const expenses: number = transactions
        .filter((t: Transaction) => t.type === "EXPENSE")
        .reduce(
            (sum: number, t: Transaction) =>
                sum + Number.parseFloat(t.amount.toString()),
            0
        );

    return (
        <div className='container mx-auto py-8 space-y-6 max-w-7xl'>
            <div className='grid gap-6'>
                {/* Account Header Card */}
                <Card className='overflow-hidden border-none shadow-md bg-gradient-to-r from-primary/10 via-background to-background'>
                    <CardContent className='p-6 sm:p-8'>
                        <div className='grid gap-6 md:grid-cols-2 items-center'>
                            <div className='space-y-4'>
                                <div className='space-y-2'>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <h1 className='text-3xl font-bold tracking-tight capitalize sm:text-4xl'>
                                            {account.name}
                                        </h1>
                                        <Badge
                                            variant='secondary'
                                            className='ml-1'
                                        >
                                            {account.type || "Saving"}
                                        </Badge>
                                    </div>
                                    <div className='grid gap-1'>
                                        <p className='text-sm text-muted-foreground'>
                                            Account ID:{" "}
                                            <span className='font-mono text-foreground'>
                                                {account.id}
                                            </span>
                                        </p>
                                        <p className='text-sm text-muted-foreground'>
                                            Holder:{" "}
                                            <span className='font-semibold text-foreground'>
                                                {account.name ||
                                                    "Hardik Bhammar"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Badge
                                        variant='outline'
                                        className={`${
                                            account.status === "Active"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : "bg-amber-50 text-amber-700 border-amber-200"
                                        }`}
                                    >
                                        {account.status || "Active"}
                                    </Badge>
                                </div>
                            </div>
                            <div className='flex justify-end gap-3 flex-wrap'>
                                <Link
                                    href={`/transaction/create?accountId=${id}`}
                                >
                                    <Button
                                        size='sm'
                                        className='gap-1.5 h-10 px-4 rounded-full shadow-sm'
                                    >
                                        <Plus className='w-4 h-4' />
                                        <span>Add Transaction</span>
                                    </Button>
                                </Link>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='gap-1.5 h-10 px-4 rounded-full shadow-sm'
                                >
                                    <Download className='w-4 h-4' />
                                    <span>Export</span>
                                </Button>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='gap-1.5 h-10 px-4 rounded-full shadow-sm'
                                >
                                    <Edit className='w-4 h-4' />
                                    <span>Edit</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Stats */}
                <div className='grid gap-4 md:grid-cols-3'>
                    <Card className='overflow-hidden shadow-sm transition-all hover:shadow-md'>
                        <CardHeader className='pb-2 bg-gradient-to-r from-primary/5 to-transparent'>
                            <div className='flex items-center gap-2'>
                                <PiggyBank className='w-5 h-5 text-primary' />
                                <CardTitle className='text-sm font-medium'>
                                    Current Balance
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className='pt-4 pb-2'>
                            <div className='text-2xl font-bold'>
                                ${account.balance.toFixed(2)}
                            </div>
                            <p className='mt-1 text-xs text-muted-foreground'>
                                {/* fix here account._count.transctions */}
                                {account.balance} transactions total
                            </p>
                        </CardContent>
                        <CardFooter className='py-2 px-6 bg-muted/20 text-xs text-muted-foreground'>
                            Updated today
                        </CardFooter>
                    </Card>

                    <Card className='overflow-hidden shadow-sm transition-all hover:shadow-md'>
                        <CardHeader className='pb-2 bg-gradient-to-r from-emerald-50 to-transparent'>
                            <div className='flex items-center gap-2'>
                                <ArrowUp className='w-5 h-5 text-emerald-600' />
                                <CardTitle className='text-sm font-medium'>
                                    Income
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className='pt-4 pb-2'>
                            <div className='text-2xl font-bold text-emerald-600'>
                                +${income.toFixed(2)}
                            </div>
                            <p className='mt-1 text-xs text-muted-foreground'>
                                {
                                    transactions.filter(
                                        (t: Transaction) => t.type === "INCOME"
                                    ).length
                                }{" "}
                                income transactions
                            </p>
                        </CardContent>
                        <CardFooter className='py-2 px-6 bg-muted/20 text-xs text-muted-foreground'>
                            Based on all transactions
                        </CardFooter>
                    </Card>

                    <Card className='overflow-hidden shadow-sm transition-all hover:shadow-md'>
                        <CardHeader className='pb-2 bg-gradient-to-r from-rose-50 to-transparent'>
                            <div className='flex items-center gap-2'>
                                <ArrowDown className='w-5 h-5 text-rose-600' />
                                <CardTitle className='text-sm font-medium'>
                                    Expenses
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className='pt-4 pb-2'>
                            <div className='text-2xl font-bold text-rose-600'>
                                -${Math.abs(expenses).toFixed(2)}
                            </div>
                            <p className='mt-1 text-xs text-muted-foreground'>
                                {
                                    transactions.filter(
                                        (t: Transaction) => t.type === "EXPENSE"
                                    ).length
                                }{" "}
                                expense transactions
                            </p>
                        </CardContent>
                        <CardFooter className='py-2 px-6 bg-muted/20 text-xs text-muted-foreground'>
                            Based on all transactions
                        </CardFooter>
                    </Card>
                </div>

                <Card className='overflow-hidden shadow-md border-none'>
                    <Tabs defaultValue='transactions' className='w-full'>
                        <div className='px-6 pt-6 border-b'>
                            <TabsList className='w-full justify-start gap-6 bg-transparent h-auto p-0'>
                                <TabsTrigger
                                    value='transactions'
                                    className='data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2 py-1 h-9 bg-transparent'
                                >
                                    <ArrowUpDown className='w-4 h-4 mr-2' />
                                    Transactions
                                </TabsTrigger>
                                <TabsTrigger
                                    value='analytics'
                                    className='data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2 py-1 h-9 bg-transparent'
                                >
                                    <LineChart className='w-4 h-4 mr-2' />
                                    Analytics
                                </TabsTrigger>
                                <TabsTrigger
                                    value='linked-cards'
                                    className='data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-2 py-1 h-9 bg-transparent'
                                >
                                    <CreditCard className='w-4 h-4 mr-2' />
                                    Linked Cards
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value='transactions' className='mt-0 p-0'>
                            <div className='p-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-lg font-semibold'>
                                        Recent Transactions
                                    </h3>
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        className='gap-1.5'
                                    >
                                        <Filter className='w-4 h-4' />
                                        <span>Filter</span>
                                    </Button>
                                </div>
                                <Suspense
                                    fallback={<TransactionTableSkeleton />}
                                >
                                    <TransactionTable
                                        transactions={transactions}
                                    />
                                </Suspense>
                            </div>
                        </TabsContent>

                        <TabsContent value='analytics' className='mt-0 p-0'>
                            <div className='p-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <h3 className='text-lg font-semibold'>
                                        Financial Analytics
                                    </h3>
                                    <div className='flex gap-2'>
                                        <Button variant='outline' size='sm'>
                                            Last 30 days
                                        </Button>
                                    </div>
                                </div>
                                <Suspense fallback={<ChartSkeleton />}>
                                    <AccountChart transactions={transactions} />
                                </Suspense>
                            </div>
                        </TabsContent>

                        <TabsContent value='linked-cards' className='mt-0 p-0'>
                            <div className='p-6'>
                                <div className='flex justify-between items-center mb-4'>
                                    <div>
                                        <h3 className='text-lg font-semibold'>
                                            Linked Cards
                                        </h3>
                                        <p className='text-sm text-muted-foreground'>
                                            Manage your connected credit/debit
                                            cards
                                        </p>
                                    </div>
                                    <Button size='sm' className='gap-1.5'>
                                        <Plus className='w-4 h-4' />
                                        <span>Add Card</span>
                                    </Button>
                                </div>

                                {/* {linkedCards?.length > 0 ? (
                                    <div className='grid gap-4 md:grid-cols-2'>
                                        {linkedCards.map((card) => (
                                            <div
                                                key={card.id}
                                                className='p-4 border rounded-lg transition-all hover:shadow-md bg-gradient-to-r from-muted/50 to-transparent'
                                            >
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-3'>
                                                        <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                                                            <CreditCard className='w-5 h-5 text-primary' />
                                                        </div>
                                                        <div>
                                                            <p className='font-medium'>
                                                                {card.name}
                                                            </p>
                                                            <p className='text-sm text-muted-foreground'>
                                                                **** **** ****{" "}
                                                                {card.last4}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='flex gap-1'>
                                                        <Button
                                                            variant='ghost'
                                                            size='icon'
                                                            className='h-8 w-8'
                                                        >
                                                            <Edit className='w-4 h-4' />
                                                        </Button>
                                                        <Button
                                                            variant='ghost'
                                                            size='icon'
                                                            className='h-8 w-8 text-destructive'
                                                        >
                                                            <Trash className='w-4 h-4' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className='bg-muted/30 border-dashed'>
                                        <CardContent className='flex flex-col items-center justify-center py-8'>
                                            <CreditCard className='w-10 h-10 text-muted-foreground mb-2' />
                                            <p className='text-muted-foreground'>
                                                No cards linked to this account
                                            </p>
                                            <Button
                                                variant='outline'
                                                size='sm'
                                                className='mt-4 gap-1.5'
                                            >
                                                <Plus className='w-4 h-4' />
                                                <span>Link a Card</span>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )} */}
                            </div>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    );
}

function TransactionTableSkeleton() {
    return (
        <div className='space-y-3'>
            <div className='flex items-center gap-4'>
                <Skeleton className='h-10 w-40' />
                <Skeleton className='h-10 w-52' />
            </div>
            <Skeleton className='h-[400px] w-full' />
        </div>
    );
}

function ChartSkeleton() {
    return (
        <div className='space-y-3'>
            <div className='flex items-center gap-4'>
                <Skeleton className='h-8 w-32' />
                <Skeleton className='h-8 w-32' />
            </div>
            <Skeleton className='h-[350px] w-full rounded-lg' />
        </div>
    );
}
