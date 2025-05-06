import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
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
        
        // Handle specific auth events if needed
        if (event === 'SIGNED_IN') {
          console.log('User signed in:', session?.user?.email);
          toast.success("Successfully signed in!", {
            className: "bg-green-50 border-green-500 text-green-800",
            style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        } else if (event === 'USER_UPDATED') {
          console.log('User updated:', session?.user);
        } else if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery initiated');
        }
      }
    );

    // Handle URL hash for password recovery and email confirmation
    const handleHashParams = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
        console.log('Password recovery detected');
        // Handle password recovery
      } else if (hash && hash.includes('type=signup')) {
        console.log('Email confirmation detected');
        // Show success toast for email verification
        toast.success("Email verified successfully! You can now login.", {
          className: "bg-green-50 border-green-500 text-green-800",
          style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
          duration: 6000
        });
      }
    };
    
    handleHashParams();

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      
      // Use the current window location for email redirects
      const redirectUrl = window.location.origin + '/auth';
      console.log("Using redirect URL:", redirectUrl);
      
      const { error, data } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name || '',
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user && !data.session) {
        // Email confirmation required
        console.log("Email confirmation required for:", email);
        console.log("User ID for manual confirmation if needed:", data.user.id);
        
        toast.success(
          <div className="space-y-2">
            <p className="font-semibold">Verification email sent!</p>
            <p>Please check your inbox and spam folder for the verification email.</p>
            <p className="text-xs">If you don't receive it within a few minutes, you may need to:</p>
            <ul className="list-disc pl-4 text-xs">
              <li>Check your spam/junk folder</li>
              <li>Verify your email address is correct</li>
              <li>Contact support if issues persist</li>
            </ul>
          </div>, 
          {
            className: "bg-green-50 border-green-500 text-green-800",
            style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
            duration: 10000
          }
        );
      } else if (data.session) {
        // Auto-confirm is enabled or email already confirmed
        navigate("/dashboard");
        toast.success("Account created successfully!", {
          className: "bg-green-50 border-green-500 text-green-800", 
          style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
        });
      }
    } catch (error: any) {
      const errorMessage = error.message || "Error signing up";
      console.error("Signup error:", errorMessage);
      
      toast.error(
        <div>
          <p className="font-semibold">Signup Failed</p>
          <p>{errorMessage}</p>
        </div>, 
        {
          className: "bg-red-50 border-red-500 text-red-800",
          style: { backgroundColor: "#fef2f2", borderLeftColor: "#ef4444" },
        }
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate("/dashboard");
      toast.success("Signed in successfully!", {
        className: "bg-green-50 border-green-500 text-green-800",
        style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
      });
    } catch (error: any) {
      const errorMessage = error.message || "Error signing in";
      console.error("Sign in error:", errorMessage);
      
      toast.error(
        <div>
          <p className="font-semibold">Sign In Failed</p>
          <p>{errorMessage}</p>
        </div>,
        {
          className: "bg-red-50 border-red-500 text-red-800",
          style: { backgroundColor: "#fef2f2", borderLeftColor: "#ef4444" },
        }
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/auth");
      toast.success("Signed out successfully!", {
        className: "bg-green-50 border-green-500 text-green-800",
        style: { backgroundColor: "#f0fdf4", borderLeftColor: "#22c55e" },
      });
    } catch (error: any) {
      const errorMessage = error.message || "Error signing out";
      console.error("Sign out error:", errorMessage);
      
      toast.error(
        <div>
          <p className="font-semibold">Sign Out Failed</p>
          <p>{errorMessage}</p>
        </div>,
        {
          className: "bg-red-50 border-red-500 text-red-800",
          style: { backgroundColor: "#fef2f2", borderLeftColor: "#ef4444" },
        }
      );
      throw error;
    } finally {
      setLoading(false);
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
