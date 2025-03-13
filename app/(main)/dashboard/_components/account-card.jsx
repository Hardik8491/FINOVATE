"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, MoreHorizontal, Router, TrendingDown, TrendingUp } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { deleteAccount } from "@/actions/account"
import { useRouter } from "next/navigation"

export function AccountCard({ account }) {
  const router = useRouter();
  // Determine card color based on account type
  const getAccountIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "checking":
        return <CreditCard className="w-5 h-5" />
      case "savings":
        return <TrendingUp className="w-5 h-5" />
      case "credit":
        return <TrendingDown className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const AccountDelete = async (id) => {
    try {
      const result = await deleteAccount(id);
      if (result) {
        toast.success("Account Delete Sucessful !")
      }

    } catch (error) {
      toast.error("Account Can't Delete !")
    }

  }


  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-full bg-primary/10">{getAccountIcon(account.type)}</div>
            <CardTitle className="text-base">{account.name}</CardTitle>
          </div>
          <CardDescription className="mt-1.5">
            {account.type}{" "}
            {account.isDefault && (
              <Badge variant="outline" className="ml-1 text-xs">
                Default
              </Badge>
            )}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`account/${account?.id}`)}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Account</DropdownMenuItem>
            <DropdownMenuItem>Set as Default</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={() => AccountDelete(account?.id)} >Remove Account</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${account.balance.toLocaleString()}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Last updated: {new Date(account.updatedAt || Date.now()).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between px-6 pt-2 pb-2 bg-muted/50">
        <Button variant="ghost" size="sm">
          Transactions
        </Button>
        <Button variant="ghost" size="sm">
          Transfer
        </Button>
      </CardFooter>
    </Card >
  )
}

