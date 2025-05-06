
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/auth'
        }
      });
      
      if (error) throw error;
      
      if (data.user && !data.session) {
        // Email confirmation required
        toast.success("Verification email sent! Please check your inbox.", {
          className: "bg-green-50 border-green-500 text-green-800",
          style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
        });
      } else if (data.session) {
        // Auto-confirm is enabled or email already confirmed
        navigate("/dashboard");
        toast.success("Account created successfully!", {
          className: "bg-green-50 border-green-500 text-green-800", 
          style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Error signing up", {
        className: "bg-red-50 border-red-500 text-red-800",
        style: { backgroundColor: "#fef2f2", borderLeftColor: "#ef4444" },
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/dashboard");
      toast.success("Signed in successfully!", {
        className: "bg-green-50 border-green-500 text-green-800",
        style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
      });
    } catch (error: any) {
      toast.error(error.message || "Error signing in", {
        className: "bg-red-50 border-red-500 text-red-800",
        style: { backgroundColor: "#fef2f2", borderLeftColor: "#ef4444" },
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
      toast.success("Signed out successfully!", {
        className: "bg-green-50 border-green-500 text-green-800",
        style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
      });
    } catch (error: any) {
      toast.error(error.message || "Error signing out", {
        className: "bg-red-50 border-red-500 text-red-800",
        style: { backgroundColor: "#fef2f2", borderLeftColor: "#ef4444" },
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
