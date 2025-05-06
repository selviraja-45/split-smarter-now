
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Settlement } from "@/models/types";

interface SettlementListProps {
  settlements: Settlement[];
  currency: string;
}

export const SettlementList = ({ settlements, currency }: SettlementListProps) => {
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
        <CardTitle>Settle Up</CardTitle>
        <CardDescription>The most efficient way to settle all debts</CardDescription>
      </CardHeader>
      <CardContent>
        {settlements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No settlements needed</p>
            <p className="text-sm mt-2">Everyone is settled up</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {settlements.map((settlement, index) => (
              <li key={index} className="flex justify-between items-center p-3 border rounded-md bg-muted/30">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{settlement.from_user_name}</span>
                  <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                  <span className="font-medium">{settlement.to_user_name}</span>
                </div>
                <div className="font-semibold">
                  {formatCurrency(settlement.amount)}
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div className="mt-6 flex justify-center">
          <Button disabled={settlements.length === 0}>
            Mark All as Settled
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
