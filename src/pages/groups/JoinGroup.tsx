
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const joinGroupSchema = z.object({
  inviteCode: z.string().min(1, { message: "Invite code is required" }),
});

type JoinGroupFormValues = z.infer<typeof joinGroupSchema>;

const JoinGroup = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<JoinGroupFormValues>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      inviteCode: "",
    },
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleJoinGroup = async (data: JoinGroupFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Find the group by invite code
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', data.inviteCode)
        .single();
      
      if (groupError) {
        if (groupError.code === 'PGRST116') {
          toast.error('Invalid invite code. Please check and try again.');
        } else {
          throw groupError;
        }
        setIsLoading(false);
        return;
      }
      
      // Check if user is already a member
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .single();
      
      if (existingMember) {
        toast.info('You are already a member of this group');
        navigate('/dashboard');
        return;
      }
      
      // Add user to the group
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'member',
        });
      
      if (joinError) throw joinError;
      
      toast.success(`You've joined "${group.name}"`);
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast.error(error.message || 'Failed to join group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-20 px-4 font-inter">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Join a Group</CardTitle>
            <CardDescription>Enter an invite code to join an existing group</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleJoinGroup)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter invite code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Joining..." : "Join Group"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-center w-full text-muted-foreground">
              You'll need an invite code from an existing group member.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default JoinGroup;
