
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GroupMembersList } from "@/components/groups/GroupMembersList";
import { GroupInviteCode } from "@/components/groups/GroupInviteCode";
import { GroupExpensesPlaceholder } from "@/components/groups/GroupExpensesPlaceholder";

interface Group {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_at: string;
  owner_id: string;
}

interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: string;
  created_at: string;
  user_email: string;
  user_name: string;
}

const GroupDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
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
          const transformedMembers = membersData.map(member => {
            // Handle case when profiles might be null or undefined
            const userEmail = member.profiles?.email ?? 'Unknown';
            const userName = member.profiles?.full_name ?? 'Unknown User';
            
            return {
              ...member,
              user_email: userEmail,
              user_name: userName
            };
          });
          
          setMembers(transformedMembers);
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
          {/* This space reserved for expenses/transactions */}
          <GroupExpensesPlaceholder />
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
