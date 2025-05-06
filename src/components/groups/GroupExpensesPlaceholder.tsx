
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface GroupExpensesPlaceholderProps {
  onAddExpense?: () => void;
}

export const GroupExpensesPlaceholder = ({ onAddExpense }: GroupExpensesPlaceholderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Shared expenses will appear here</CardDescription>
          </div>
          {onAddExpense && (
            <Button onClick={onAddExpense}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <p>No expenses yet</p>
          <p className="text-sm mt-2">
            {onAddExpense 
              ? "Click 'Add Expense' to get started" 
              : "Expense tracking coming soon"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
