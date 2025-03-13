import { Suspense } from "react"
import { getAccountWithTransactions } from "@/actions/account"
import { notFound } from "next/navigation"
import { TransactionTable } from "../_components/transaction-table"
import { AccountChart } from "../_components/account-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Download, Filter, Plus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default async function AccountPage({ params }) {
  const { id } = params
  const accountData = await getAccountWithTransactions(id)

  if (!accountData) {
    notFound()
  }

  const { transactions, ...account } = accountData

  // Calculate some basic stats
  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  const expenses = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0)

  return (
    <div className="container py-6 mx-auto space-y-8 max-w-7xl">
      {/* Account Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize sm:text-4xl">{account.name}</h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/transaction/create?accountId=${id}`}>
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number.parseFloat(account.balance).toFixed(2)}</div>
            <p className="mt-1 text-xs text-muted-foreground">{account._count.transactions} transactions total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">+${income.toFixed(2)}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {transactions.filter((t) => t.type === "INCOME").length} income transactions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">-${Math.abs(expenses).toFixed(2)}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {transactions.filter((t) => t.type === "EXPENSE").length} expense transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Chart and Transactions */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <ArrowUpDown className="h-3.5 w-3.5 mr-1.5" />
              Sort
            </Button>
          </div>
        </div>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Suspense fallback={<TransactionTableSkeleton />}>
                <TransactionTable transactions={transactions} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analytics</CardTitle>
              <CardDescription>View your spending patterns and transaction history</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Suspense fallback={<ChartSkeleton />}>
                <AccountChart transactions={transactions} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TransactionTableSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="w-full h-8" />
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="w-full h-16" />
          ))}
      </div>
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[300px] w-full" />
      <div className="flex justify-center gap-2">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="w-20 h-4" />
          ))}
      </div>
    </div>
  )
}

