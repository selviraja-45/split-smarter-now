
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
import { nanoid } from 'nanoid';

const createGroupSchema = z.object({
  name: z.string().min(3, { message: "Group name must be at least 3 characters" }),
  description: z.string().optional(),
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

const CreateGroup = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleCreateGroup = async (data: CreateGroupFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Generate a unique invite code
      const inviteCode = nanoid(8);
      
      // Create the group
      const { data: group, error } = await supabase
        .from('groups')
        .insert({
          name: data.name,
          description: data.description || null,
          invite_code: inviteCode,
          owner_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add the creator as a member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'owner',
        });
      
      if (memberError) throw memberError;
      
      toast.success('Group created successfully!');
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(error.message || 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-20 px-4 font-inter">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Group</CardTitle>
            <CardDescription>Create a group to start splitting expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateGroup)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Roommates, Trip to Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of your group" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Group"}
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
              You'll be automatically added as the owner of this group.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateGroup;
