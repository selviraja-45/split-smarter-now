
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface GroupInviteCodeProps {
  inviteCode: string;
}

export const GroupInviteCode = ({ inviteCode }: GroupInviteCodeProps) => {
  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied to clipboard');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
          <div className="font-mono text-sm">{inviteCode}</div>
          <Button variant="ghost" size="icon" onClick={copyInviteCode}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Share this code with others to invite them to your group
        </p>
      </CardContent>
    </Card>
  );
};
