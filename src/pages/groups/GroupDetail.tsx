
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, Users } from "lucide-react";

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
        // Using a JOIN query to get member information
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
        // Handle potential profile issues safely
        if (membersData) {
          const transformedMembers = membersData.map(member => {
            // Handle case when profiles might be an error or null
            let userEmail = 'Unknown';
            let userName = 'Unknown User';
            
            if (member.profiles && typeof member.profiles === 'object' && !('error' in member.profiles)) {
              userEmail = member.profiles.email || 'Unknown';
              userName = member.profiles.full_name || 'Unknown User';
            }
            
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

  const copyInviteCode = () => {
    if (!group) return;
    
    navigator.clipboard.writeText(group.invite_code);
    toast.success('Invite code copied to clipboard');
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
          {/* This space reserved for expenses/transactions */}
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
        </div>

        <div className="md:col-span-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Members</span>
                <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded">
                  {members.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {members.map((member) => (
                  <li key={member.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p>{member.user_name}</p>
                      <p className="text-xs text-muted-foreground">{member.user_email}</p>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                      {member.role}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {isOwner && (
            <Card>
              <CardHeader>
                <CardTitle>Invite Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="font-mono text-sm">{group.invite_code}</div>
                  <Button variant="ghost" size="icon" onClick={copyInviteCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Share this code with others to invite them to your group
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
