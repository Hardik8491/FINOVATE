import { getUserAccounts } from "@/actions/dashboard"
import { getDashboardData } from "@/actions/dashboard"
import { getCurrentBudget } from "@/actions/budget"
import { AccountCard } from "./_components/account-card"
import { CreateAccountDrawer } from "@/components/create-account-drawer"
import { BudgetProgress } from "./_components/budget-progress"
import { DashboardOverview } from "./_components/transaction-overview"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCard,
  DollarSign,
  Home,
  LineChart,
  Plus,
  Settings,
  Wallet,
} from "lucide-react"

export default async function DashboardPage() {
  let accounts = []
  let transactions = []
  let budgetData = null
  let errorMessage = null
  console.log(budgetData)

  try {
    ;[accounts, transactions] = await Promise.all([getUserAccounts(), getDashboardData()])
  } catch (error) {
    console.error("Error fetching accounts or transactions:", error)
    errorMessage = "Failed to load account and transaction data."
  }

  const defaultAccount = accounts?.find((account) => account.isDefault)

  // Get budget for default account
  if (defaultAccount) {
    try {
      budgetData = await getCurrentBudget(defaultAccount.id)
      console.log(budgetData)
    } catch (error) {
      console.error("Error fetching budget data:", error)
      errorMessage = "Failed to load budget data."
    }
  }


  // Calculate total balance across all accounts
  const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0

  // Get recent income and expenses from transactions
  const recentIncome = transactions?.filter((t) => t.type === "INCOME")?.reduce((sum, t) => sum + t.amount, 0) || 0

  const recentExpenses = transactions?.filter((t) => t.type === "EXPENSE")?.reduce((sum, t) => sum + t.amount, 0) || 0

  return (
    <div className="flex  w-full min-h-screen bg-background">
      {/* Sidebar */}


      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

          </div>

          {/* Error Alert */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across {accounts?.length || 0} accounts</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Recent Income</CardTitle>
                <ArrowUpIcon className="w-4 h-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">+${recentIncome.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Recent Expenses</CardTitle>
                <ArrowDownIcon className="w-4 h-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-500">-${Math.abs(recentExpenses).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget</CardTitle>
              <CardDescription>Track your spending against your monthly budget</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetProgress initialBudget={budgetData?.budget?.amount} currentExpenses={budgetData?.currentExpenses || 0} />
            </CardContent>
          </Card>

          {/* Tabs for Accounts and Transactions */}
          <Tabs defaultValue="accounts" className="space-y-4">
            <TabsList>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {defaultAccount && <AccountCard key={defaultAccount.id} account={defaultAccount} />}

                {accounts
                  ?.filter((acc) => !acc.isDefault)
                  .map((account) => (
                    <AccountCard key={account.id} account={account} />
                  ))}

                <CreateAccountDrawer>
                  <Card className="transition-all border-dashed cursor-pointer hover:border-primary/50 hover:bg-muted/50">
                    <CardContent className="flex flex-col items-center justify-center h-full pt-6 pb-6">
                      <div className="p-3 mb-2 rounded-full bg-primary/10">
                        <Plus className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium">Add New Account</p>
                      <p className="mt-1 text-xs text-muted-foreground">Connect a bank or create manually</p>
                    </CardContent>
                  </Card>
                </CreateAccountDrawer>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your recent financial activity across all accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardOverview accounts={accounts} transactions={transactions || []} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

