
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GroupList from "@/components/groups/GroupList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
  owner_id: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Get groups the user belongs to by querying group_members
        // This relies on RLS policies to only return groups the user is a member of
        const { data: memberGroups, error: memberError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('user_id', user.id);

        if (memberError) throw memberError;

        if (memberGroups && memberGroups.length > 0) {
          const groupIds = memberGroups.map(mg => mg.group_id);
          
          const { data, error } = await supabase
            .from('groups')
            .select('*')
            .in('id', groupIds);

          if (error) throw error;
          setGroups(data || []);
        } else {
          setGroups([]);
        }
      } catch (error: any) {
        console.error('Error fetching groups:', error);
        toast.error('Failed to load groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto py-20 px-4 font-inter">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.user_metadata.name || user.email}</h1>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Your Groups</CardTitle>
            <CardDescription>View and manage your expense groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link to="/groups/create">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </Link>
              <Link to="/groups/join">
                <Button variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Group
                </Button>
              </Link>
            </div>

            <div className="mt-6">
              {loading ? (
                <p>Loading your groups...</p>
              ) : groups.length > 0 ? (
                <GroupList groups={groups} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">You're not part of any groups yet</p>
                  <p className="text-sm text-muted-foreground">
                    Create a new group or join an existing one to get started
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
