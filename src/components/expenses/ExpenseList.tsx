
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Filter, ArrowDownUp } from "lucide-react";
import { ExpenseItem } from "./ExpenseItem";
import { Expense, ExpenseParticipant, GroupMember } from "@/models/types";
import { CreateExpenseDialog } from "./CreateExpenseDialog";

interface ExpenseListProps {
  expenses: Expense[];
  participants: ExpenseParticipant[];
  members: GroupMember[];
  groupId: string;
  onCreateExpense: (expense: Expense, participants: ExpenseParticipant[]) => void;
}

export const ExpenseList = ({ 
  expenses, 
  participants, 
  members,
  groupId,
  onCreateExpense 
}: ExpenseListProps) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (sortBy === 'date') {
      return sortDirection === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return sortDirection === 'asc' 
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>
              {expenses.length} expense{expenses.length !== 1 ? 's' : ''} in this group
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
        <div className="flex gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleSort('date')}
            className={sortBy === 'date' ? 'bg-muted' : ''}
          >
            Date
            {sortBy === 'date' && (
              <ArrowDownUp className={`ml-2 h-3 w-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toggleSort('amount')}
            className={sortBy === 'amount' ? 'bg-muted' : ''}
          >
            Amount
            {sortBy === 'amount' && (
              <ArrowDownUp className={`ml-2 h-3 w-3 ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No expenses yet</p>
            <p className="text-sm mt-2">Add an expense to get started</p>
          </div>
        ) : (
          <div className="divide-y">
            {sortedExpenses.map((expense) => (
              <ExpenseItem 
                key={expense.id} 
                expense={expense} 
                participants={participants.filter(p => p.expense_id === expense.id)}
                members={members}
              />
            ))}
          </div>
        )}
      </CardContent>

      <CreateExpenseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        groupId={groupId}
        members={members}
        onCreateExpense={onCreateExpense}
      />
    </Card>
  );
};
