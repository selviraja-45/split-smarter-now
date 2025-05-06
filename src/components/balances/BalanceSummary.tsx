
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Balance, Currency, GroupMember } from "@/models/types";

interface BalanceSummaryProps {
  balances: Balance[];
  members: GroupMember[];
  currency: string;
}

export const BalanceSummary = ({ balances, members, currency }: BalanceSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Summary</CardTitle>
        <CardDescription>Current balance for each member</CardDescription>
      </CardHeader>
      <CardContent>
        {balances.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No balances yet</p>
            <p className="text-sm mt-2">Add expenses to see balances</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {balances.map((balance) => (
              <li key={balance.user_id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {balance.user_name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{balance.user_name}</span>
                </div>
                <div className={`font-medium ${balance.net_balance > 0 
                  ? 'text-green-600' 
                  : balance.net_balance < 0 
                    ? 'text-red-600' 
                    : 'text-gray-500'}`}>
                  {balance.net_balance > 0 
                    ? `Gets ${formatCurrency(balance.net_balance)}` 
                    : balance.net_balance < 0 
                      ? `Owes ${formatCurrency(Math.abs(balance.net_balance))}` 
                      : `Settled up`}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
