
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const GroupExpensesPlaceholder = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>Shared expenses will appear here</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <p>No expenses yet</p>
          <p className="text-sm mt-2">Expense tracking coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
};
