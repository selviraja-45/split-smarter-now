
// User and Auth types
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Group types
export interface Group {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_at: string;
  owner_id: string;
}

export interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: string;
  created_at: string;
  user_email: string;
  user_name: string;
}

// Expense types
export interface Expense {
  id: string;
  group_id: string;
  created_by: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  payer_id: string;
  split_type: 'equal' | 'custom';
  created_at: string;
}

export interface ExpenseParticipant {
  id: string;
  expense_id: string;
  user_id: string;
  amount: number;
  percentage: number;
  user_name?: string;
}

export interface Balance {
  user_id: string;
  user_name: string;
  net_balance: number;
}

export interface Settlement {
  from_user_id: string;
  from_user_name: string;
  to_user_id: string;
  to_user_name: string;
  amount: number;
}

// Currency types
export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

// Mock data generators
export const generateMockExpenses = (groupId: string, members: GroupMember[], count: number = 5): Expense[] => {
  const currencies = ['USD', 'EUR', 'INR', 'GBP'];
  const descriptions = [
    'Lunch at restaurant', 
    'Groceries', 
    'Movie tickets', 
    'Gas for road trip',
    'Dinner', 
    'Utility bill', 
    'Hotel booking', 
    'Taxi fare'
  ];

  return Array.from({ length: count }, (_, i) => {
    const randomMember = members[Math.floor(Math.random() * members.length)];
    const randomAmount = Math.floor(Math.random() * 1000) + 100; // Random amount between 100 and 1100
    
    return {
      id: `exp-${i}-${Date.now()}`,
      group_id: groupId,
      created_by: randomMember.user_id,
      amount: randomAmount,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      payer_id: randomMember.user_id,
      split_type: Math.random() > 0.3 ? 'equal' : 'custom',
      created_at: new Date().toISOString()
    };
  });
};

export const generateMockExpenseParticipants = (expenses: Expense[], members: GroupMember[]): ExpenseParticipant[] => {
  const participants: ExpenseParticipant[] = [];
  
  expenses.forEach(expense => {
    const participantCount = Math.max(2, Math.floor(Math.random() * members.length) + 1);
    const selectedMembers = [...members].sort(() => Math.random() - 0.5).slice(0, participantCount);
    
    if (expense.split_type === 'equal') {
      const equalAmount = expense.amount / participantCount;
      selectedMembers.forEach((member, index) => {
        participants.push({
          id: `part-${expense.id}-${member.user_id}`,
          expense_id: expense.id,
          user_id: member.user_id,
          amount: equalAmount,
          percentage: 100 / participantCount,
          user_name: member.user_name
        });
      });
    } else {
      // Custom split
      let remainingPercentage = 100;
      let remainingAmount = expense.amount;
      
      selectedMembers.forEach((member, index) => {
        const isLast = index === selectedMembers.length - 1;
        const percentage = isLast ? remainingPercentage : Math.floor(Math.random() * remainingPercentage * 0.8);
        const amount = isLast ? remainingAmount : (expense.amount * percentage / 100);
        
        participants.push({
          id: `part-${expense.id}-${member.user_id}`,
          expense_id: expense.id,
          user_id: member.user_id,
          amount: Number(amount.toFixed(2)),
          percentage: percentage,
          user_name: member.user_name
        });
        
        remainingPercentage -= percentage;
        remainingAmount -= amount;
      });
    }
  });
  
  return participants;
};

export const calculateBalances = (expenses: Expense[], participants: ExpenseParticipant[], members: GroupMember[]): Balance[] => {
  const balances: Record<string, number> = {};
  
  // Initialize balances for all members
  members.forEach(member => {
    balances[member.user_id] = 0;
  });
  
  // Calculate amounts paid and owed
  expenses.forEach(expense => {
    // Add the full amount as positive for the person who paid
    balances[expense.payer_id] += expense.amount;
    
    // Subtract the amounts owed by each participant
    const expenseParticipants = participants.filter(p => p.expense_id === expense.id);
    expenseParticipants.forEach(participant => {
      balances[participant.user_id] -= participant.amount;
    });
  });
  
  return members.map(member => ({
    user_id: member.user_id,
    user_name: member.user_name,
    net_balance: Number(balances[member.user_id].toFixed(2))
  }));
};

export const calculateSettlements = (balances: Balance[]): Settlement[] => {
  const settlements: Settlement[] = [];
  const debtors = [...balances].filter(b => b.net_balance < 0).sort((a, b) => a.net_balance - b.net_balance);
  const creditors = [...balances].filter(b => b.net_balance > 0).sort((a, b) => b.net_balance - a.net_balance);
  
  while (debtors.length > 0 && creditors.length > 0) {
    const debtor = debtors[0];
    const creditor = creditors[0];
    
    const debtorOwes = Math.abs(debtor.net_balance);
    const creditorIsOwed = creditor.net_balance;
    
    const amount = Math.min(debtorOwes, creditorIsOwed);
    
    if (amount > 0) {
      settlements.push({
        from_user_id: debtor.user_id,
        from_user_name: debtor.user_name,
        to_user_id: creditor.user_id,
        to_user_name: creditor.user_name,
        amount
      });
    }
    
    debtor.net_balance += amount;
    creditor.net_balance -= amount;
    
    if (Math.abs(debtor.net_balance) < 0.01) {
      debtors.shift();
    }
    
    if (Math.abs(creditor.net_balance) < 0.01) {
      creditors.shift();
    }
  }
  
  return settlements;
};
