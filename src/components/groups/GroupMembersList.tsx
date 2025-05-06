
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface GroupMember {
  id: string;
  user_id: string;
  group_id: string;
  role: string;
  created_at: string;
  user_email: string;
  user_name: string;
}

interface GroupMembersListProps {
  members: GroupMember[];
}

export const GroupMembersList = ({ members }: GroupMembersListProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Members</span>
          </span>
          <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded">
            {members.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {members.map((member) => (
            <li key={member.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {member.user_name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p>{member.user_name}</p>
                  <p className="text-xs text-muted-foreground">{member.user_email}</p>
                </div>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                {member.role}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
