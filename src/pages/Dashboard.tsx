
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">
        Welcome, {user.email}! You are now signed in.
      </p>
      <p className="text-gray-600">
        This is a placeholder for the dashboard content. The expense splitting functionality will be implemented in upcoming steps.
      </p>
    </div>
  );
};

export default Dashboard;
