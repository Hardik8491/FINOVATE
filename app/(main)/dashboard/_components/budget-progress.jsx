"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Edit2, Save } from "lucide-react"

export function BudgetProgress({ initialBudget = 1000, currentExpenses = 0 }) {
  const [budget, setBudget] = useState(initialBudget)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(initialBudget.toString())

  const percentUsed = Math.min(100, Math.round((currentExpenses / budget) * 100))
  const remaining = budget - currentExpenses

  // Determine progress color based on percentage
  const getProgressColor = () => {
    if (percentUsed > 90) return "bg-destructive"
    if (percentUsed > 75) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const handleSave = () => {
    const newBudget = Number.parseFloat(inputValue)
    if (!isNaN(newBudget) && newBudget > 0) {
      setBudget(newBudget)
    } else {
      setInputValue(budget.toString())
    }
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Monthly Budget</h3>
            {!isEditing ? (
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-3.5 w-3.5" />
                <span className="sr-only">Edit Budget</span>
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="w-6 h-6" onClick={handleSave}>
                <Save className="h-3.5 w-3.5" />
                <span className="sr-only">Save Budget</span>
              </Button>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{percentUsed}% of budget used</div>
        </div>
        <div className="text-right">
          {isEditing ? (
            <div className="flex items-center">
              <span className="mr-2">$</span>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-24 h-8"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
          ) : (
            <>
              <div className="font-medium">${budget.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Budget</div>
            </>
          )}
        </div>
      </div>

      <Progress value={percentUsed} className="h-2" indicatorclassname={getProgressColor()} />

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="p-3 rounded-lg bg-muted">
          <div className="text-sm font-medium">Spent</div>
          <div className="text-lg font-bold text-rose-500">${currentExpenses.toLocaleString()}</div>
        </div>
        <div className="p-3 rounded-lg bg-muted">
          <div className="text-sm font-medium">Remaining</div>
          <div className={`text-lg font-bold ${remaining >= 0 ? "text-emerald-500" : "text-destructive"}`}>
            ${remaining.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}



// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Edit2, Save } from "lucide-react"
// import { updateBudget } from "@/actions/budget"


// export function BudgetProgress({ initialBudget = 1000, currentExpenses = 0 }) {
//   const [budget, setBudget] = useState(initialBudget)
//   const [isEditing, setIsEditing] = useState(false)
//   const [inputValue, setInputValue] = useState(initialBudget.toString())

//   const percentUsed = Math.min(100, Math.round((currentExpenses / budget) * 100))
//   const remaining = budget - currentExpenses

//   const handleSave = async () => {
//     const newBudget = Number.parseFloat(inputValue)
//     if (!isNaN(newBudget) && newBudget > 0) {
//       try {
//         await updateBudget(newBudget)
//         setBudget(newBudget)
//         toast.success("Budget updated successfully!")
//       } catch (error) {
//         toast.error("Failed to update budget. Please try again.")
//       }
//     } else {
//       setInputValue(budget.toString())
//     }
//     setIsEditing(false)
//   }

//   return (
//     <Card>
//       <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
//         <CardTitle className="text-sm font-medium">Monthly Budget</CardTitle>
//         {!isEditing ? (
//           <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
//             <Edit2 className="w-4 h-4" />
//           </Button>
//         ) : (
//           <Button variant="ghost" size="icon" onClick={handleSave}>
//             <Save className="w-4 h-4" />
//           </Button>
//         )}
//       </CardHeader>
//       <CardContent>
//         <div className="flex justify-between mb-2">
//           <span>Progress</span>
//           <span className="font-semibold">{percentUsed}%</span>
//         </div>
//         <Progress value={percentUsed} className="h-2" />
//         <div className="mt-4 space-y-2">
//           {isEditing ? (
//             <div className="flex items-center">
//               <span className="mr-2">$</span>
//               <Input
//                 type="number"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 className="max-w-[120px]"
//                 onKeyDown={(e) => e.key === "Enter" && handleSave()}
//               />
//             </div>
//           ) : (
//             <div className="flex justify-between">
//               <span>Total Budget</span>
//               <span className="font-semibold">$budget</span>
//             </div>
//           )}
//           <div className="flex justify-between">
//             <span>Spent</span>
//             <span className="font-semibold text-rose-500">$currentExpenses.toFixed(2)</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Remaining</span>
//             <span className={`font-semibold ${remaining >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
//               ${remaining.toFixed(2)}
//             </span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

