
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GroupMembersList } from "@/components/groups/GroupMembersList";
import { GroupInviteCode } from "@/components/groups/GroupInviteCode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { BalanceSummary } from "@/components/balances/BalanceSummary";
import { SettlementList } from "@/components/settlements/SettlementList";
import { Group, GroupMember, Expense, ExpenseParticipant, Balance, Settlement, generateMockExpenses, generateMockExpenseParticipants, calculateBalances, calculateSettlements } from "@/models/types";

// Define proper profile type to avoid TypeScript errors
interface Profile {
  email: string | null;
  full_name: string | null;
}

interface MemberWithProfile {
  id: string;
  user_id: string;
  group_id: string;
  role: string;
  created_at: string;
  profiles: Profile | null | { error: true };
}

const GroupDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [participants, setParticipants] = useState<ExpenseParticipant[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [activeCurrency, setActiveCurrency] = useState("USD");
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      if (!user || !id) return;

      try {
        setLoading(true);

        // Check if user is a member of this group
        const { data: membershipCheck, error: membershipError } = await supabase
          .from('group_members')
          .select('role')
          .eq('group_id', id)
          .eq('user_id', user.id)
          .single();

        if (membershipError) {
          // If not a member, redirect to dashboard
          navigate('/dashboard');
          toast.error('You do not have access to this group');
          return;
        }

        if (membershipCheck?.role) {
          setIsOwner(membershipCheck.role === 'owner');
        }

        // Fetch group details
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', id)
          .single();

        if (groupError) throw groupError;
        setGroup(groupData);

        // Fetch group members with user profiles
        const { data: membersData, error: membersError } = await supabase
          .from('group_members')
          .select(`
            *,
            profiles:user_id (
              email,
              full_name
            )
          `)
          .eq('group_id', id);

        if (membersError) throw membersError;
        
        // Transform the data to flatten the structure
        if (membersData) {
          const transformedMembers = membersData.map((member: MemberWithProfile) => {
            // Handle cases when profiles might have an error, be null, or undefined
            let userEmail = 'Unknown';
            let userName = 'Unknown User';
            
            // Check if profiles is not an error and actually contains data
            if (member.profiles && !('error' in member.profiles)) {
              userEmail = member.profiles.email ?? 'Unknown';
              userName = member.profiles.full_name ?? 'Unknown User';
            }
            
            return {
              ...member,
              user_email: userEmail,
              user_name: userName
            };
          });
          
          setMembers(transformedMembers);
          
          // For development, generate mock expenses
          if (transformedMembers.length > 0) {
            const mockExpenses = generateMockExpenses(id, transformedMembers, 8);
            setExpenses(mockExpenses);
            
            const mockParticipants = generateMockExpenseParticipants(mockExpenses, transformedMembers);
            setParticipants(mockParticipants);
            
            const calculatedBalances = calculateBalances(mockExpenses, mockParticipants, transformedMembers);
            setBalances(calculatedBalances);
            
            const calculatedSettlements = calculateSettlements(calculatedBalances);
            setSettlements(calculatedSettlements);
          }
        }
      } catch (error: any) {
        console.error('Error fetching group details:', error);
        toast.error('Failed to load group details');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [user, id, navigate]);

  const handleCreateExpense = (newExpense: Expense, newParticipants: ExpenseParticipant[]) => {
    // Add expense and participants to state
    setExpenses(prev => [...prev, newExpense]);
    setParticipants(prev => [...prev, ...newParticipants]);
    
    // Recalculate balances and settlements
    const updatedBalances = calculateBalances(
      [...expenses, newExpense], 
      [...participants, ...newParticipants], 
      members
    );
    setBalances(updatedBalances);
    
    const updatedSettlements = calculateSettlements(updatedBalances);
    setSettlements(updatedSettlements);
    
    toast.success('Expense added successfully');
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="container mx-auto py-20 px-4 font-inter">
        <div className="text-center">Loading group information...</div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto py-20 px-4 font-inter">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Group not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-20 px-4 font-inter">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{group.name}</h1>
        {group.description && <p className="text-muted-foreground mt-1">{group.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <Tabs defaultValue="expenses">
            <TabsList className="mb-4">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="balances">Balances</TabsTrigger>
              <TabsTrigger value="settle">Settle Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="expenses">
              <ExpenseList 
                expenses={expenses} 
                participants={participants} 
                members={members} 
                groupId={group.id}
                onCreateExpense={handleCreateExpense}
              />
            </TabsContent>
            
            <TabsContent value="balances">
              <BalanceSummary 
                balances={balances} 
                members={members} 
                currency={activeCurrency}
              />
            </TabsContent>
            
            <TabsContent value="settle">
              <SettlementList 
                settlements={settlements} 
                currency={activeCurrency}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:col-span-4">
          <GroupMembersList members={members} />

          {isOwner && (
            <GroupInviteCode inviteCode={group.invite_code} />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
