
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface Group {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
  owner_id: string;
}

interface GroupListProps {
  groups: Group[];
}

const GroupList = ({ groups }: GroupListProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Card key={group.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Group</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to={`/groups/${group.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Group
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default GroupList;
