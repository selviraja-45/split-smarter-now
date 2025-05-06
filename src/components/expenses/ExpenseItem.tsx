
import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, User } from 'lucide-react';
import { Expense, ExpenseParticipant, GroupMember } from '@/models/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ExpenseItemProps {
  expense: Expense;
  participants: ExpenseParticipant[];
  members: GroupMember[];
}

export const ExpenseItem = ({ expense, participants, members }: ExpenseItemProps) => {
  const [expanded, setExpanded] = useState(false);

  // Find the payer from members
  const payer = members.find(m => m.user_id === expense.payer_id);
  
  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formattedDate = format(new Date(expense.date), 'MMM d, yyyy');
  
  return (
    <div className="py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {payer?.user_name.substring(0, 2).toUpperCase() || <User size={16} />}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{expense.description}</h4>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{formattedDate}</span>
              <span className="text-xs">•</span>
              <span>Paid by {payer?.user_name}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">{formatCurrency(expense.amount, expense.currency)}</div>
          <div className="text-sm text-muted-foreground">
            {expense.split_type === 'equal' ? 'Split equally' : 'Custom split'}
          </div>
        </div>
      </div>
      
      {participants.length > 0 && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-xs text-muted-foreground p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Hide details
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show details ({participants.length} participants)
              </>
            )}
          </Button>
          
          {expanded && (
            <div className="mt-3 pl-4 border-l-2 border-muted-foreground/20">
              <div className="text-xs text-muted-foreground mb-2">Participants</div>
              <div className="space-y-2">
                {participants.map((participant) => {
                  const participantMember = members.find(m => m.user_id === participant.user_id);
                  return (
                    <div key={participant.id} className="flex justify-between text-sm">
                      <div>{participantMember?.user_name}</div>
                      <div className="flex items-center gap-2">
                        <span>{participant.percentage}%</span>
                        <span className="font-medium">
                          {formatCurrency(participant.amount, expense.currency)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
