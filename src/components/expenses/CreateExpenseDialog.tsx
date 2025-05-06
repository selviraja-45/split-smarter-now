
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expense, ExpenseParticipant, GroupMember } from "@/models/types";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  members: GroupMember[];
  onCreateExpense: (expense: Expense, participants: ExpenseParticipant[]) => void;
}

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "GBP", symbol: "£", name: "British Pound" },
];

export const CreateExpenseDialog = ({ 
  open, 
  onOpenChange, 
  groupId, 
  members, 
  onCreateExpense 
}: CreateExpenseDialogProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [payerId, setPayerId] = useState("");
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [selectedParticipants, setSelectedParticipants] = useState<Record<string, boolean>>({});
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [customPercentages, setCustomPercentages] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleParticipantToggle = (userId: string, checked: boolean) => {
    setSelectedParticipants(prev => ({
      ...prev,
      [userId]: checked
    }));

    if (!checked) {
      // Remove from custom amounts/percentages if unchecked
      const { [userId]: _, ...restAmounts } = customAmounts;
      const { [userId]: __, ...restPercentages } = customPercentages;
      setCustomAmounts(restAmounts);
      setCustomPercentages(restPercentages);
    } else if (splitType === "custom") {
      // Initialize custom values if checked
      setCustomAmounts(prev => ({
        ...prev,
        [userId]: "0"
      }));
      setCustomPercentages(prev => ({
        ...prev,
        [userId]: "0"
      }));
    }
  };

  const handleSplitTypeChange = (value: string) => {
    setSplitType(value as "equal" | "custom");
    
    if (value === "equal") {
      setCustomAmounts({});
      setCustomPercentages({});
    } else {
      // Initialize custom values for selected participants
      const initialAmounts: Record<string, string> = {};
      const initialPercentages: Record<string, string> = {};
      
      Object.keys(selectedParticipants).forEach(userId => {
        if (selectedParticipants[userId]) {
          initialAmounts[userId] = "0";
          initialPercentages[userId] = "0";
        }
      });
      
      setCustomAmounts(initialAmounts);
      setCustomPercentages(initialPercentages);
    }
  };

  const updateCustomAmount = (userId: string, value: string) => {
    setCustomAmounts(prev => ({
      ...prev,
      [userId]: value
    }));
    
    // Update percentage based on amount
    const amountValue = parseFloat(value) || 0;
    const totalAmount = parseFloat(amount) || 0;
    const percentage = totalAmount > 0 ? (amountValue / totalAmount) * 100 : 0;
    
    setCustomPercentages(prev => ({
      ...prev,
      [userId]: percentage.toFixed(1)
    }));
  };

  const updateCustomPercentage = (userId: string, value: string) => {
    setCustomPercentages(prev => ({
      ...prev,
      [userId]: value
    }));
    
    // Update amount based on percentage
    const percentageValue = parseFloat(value) || 0;
    const totalAmount = parseFloat(amount) || 0;
    const amountValue = (percentageValue / 100) * totalAmount;
    
    setCustomAmounts(prev => ({
      ...prev,
      [userId]: amountValue.toFixed(2)
    }));
  };

  const calculateRemainingPercentage = () => {
    const totalPercentage = Object.values(customPercentages)
      .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    return 100 - totalPercentage;
  };

  const calculateRemainingAmount = () => {
    const totalAssignedAmount = Object.values(customAmounts)
      .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const totalAmount = parseFloat(amount) || 0;
    return totalAmount - totalAssignedAmount;
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setCurrency("USD");
    setDate(new Date().toISOString().split('T')[0]);
    setPayerId("");
    setSplitType("equal");
    setSelectedParticipants({});
    setCustomAmounts({});
    setCustomPercentages({});
  };

  const handleSubmit = () => {
    if (!description || !amount || !payerId || !date) {
      // Show validation errors
      return;
    }
    
    const participantIds = Object.keys(selectedParticipants).filter(id => selectedParticipants[id]);
    
    if (participantIds.length === 0) {
      // Need at least one participant
      return;
    }
    
    setIsSubmitting(true);
    
    const expenseId = `exp-${Date.now()}`;
    const numericAmount = parseFloat(amount);
    
    const newExpense: Expense = {
      id: expenseId,
      group_id: groupId,
      created_by: payerId, // Assuming the payer is also the creator
      amount: numericAmount,
      currency,
      description,
      date,
      payer_id: payerId,
      split_type: splitType,
      created_at: new Date().toISOString()
    };
    
    const expenseParticipants: ExpenseParticipant[] = participantIds.map(userId => {
      let participantAmount: number;
      let participantPercentage: number;
      
      if (splitType === "equal") {
        participantAmount = numericAmount / participantIds.length;
        participantPercentage = 100 / participantIds.length;
      } else {
        participantAmount = parseFloat(customAmounts[userId]) || 0;
        participantPercentage = parseFloat(customPercentages[userId]) || 0;
      }
      
      const member = members.find(m => m.user_id === userId);
      
      return {
        id: `part-${expenseId}-${userId}`,
        expense_id: expenseId,
        user_id: userId,
        amount: Number(participantAmount.toFixed(2)),
        percentage: Number(participantPercentage.toFixed(1)),
        user_name: member?.user_name
      };
    });
    
    onCreateExpense(newExpense, expenseParticipants);
    resetForm();
    onOpenChange(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            Enter the expense details and how it should be split among group members.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="payer">Paid by</Label>
            <Select value={payerId} onValueChange={setPayerId}>
              <SelectTrigger>
                <SelectValue placeholder="Who paid?" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.user_id} value={member.user_id}>
                    {member.user_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="split-type">Split type</Label>
            <Select value={splitType} onValueChange={handleSplitTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Equal split</SelectItem>
                <SelectItem value="custom">Custom split</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>Participants</Label>
            <div className="border rounded-md p-4 space-y-3">
              {members.map((member) => (
                <div key={member.user_id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`participant-${member.user_id}`}
                      checked={!!selectedParticipants[member.user_id]}
                      onCheckedChange={(checked: boolean) => handleParticipantToggle(member.user_id, checked)}
                    />
                    <Label htmlFor={`participant-${member.user_id}`} className="cursor-pointer">
                      {member.user_name}
                    </Label>
                  </div>
                  
                  {splitType === "custom" && selectedParticipants[member.user_id] && (
                    <div className="flex items-center space-x-2">
                      <Input
                        className="w-20"
                        value={customAmounts[member.user_id] || ""}
                        onChange={(e) => updateCustomAmount(member.user_id, e.target.value)}
                        placeholder="0.00"
                      />
                      <Input
                        className="w-16"
                        value={customPercentages[member.user_id] || ""}
                        onChange={(e) => updateCustomPercentage(member.user_id, e.target.value)}
                        placeholder="%"
                        suffix="%"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {splitType === "custom" && (
            <div className="flex justify-between text-sm">
              <span>Remaining:</span>
              <div>
                <span className={`${calculateRemainingPercentage() !== 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {calculateRemainingPercentage().toFixed(1)}%
                </span>
                {" / "}
                <span className={`${calculateRemainingAmount() !== 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {CURRENCIES.find(c => c.code === currency)?.symbol}
                  {calculateRemainingAmount().toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
