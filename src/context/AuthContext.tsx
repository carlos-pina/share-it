import type { AuthResponse, AuthTokenResponsePassword, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

interface Credentials {
  user: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  signUp: (credentials: Credentials) => Promise<AuthResponse>;
  signIn: (credentials: Credentials) => Promise<AuthTokenResponsePassword>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (credentials: Credentials): Promise<AuthResponse> => {
    return await supabase.auth.signUp({ 
      email: credentials.user, 
      password: credentials.password
    });
  };

  const signIn = async (credentials: Credentials): Promise<AuthTokenResponsePassword> => {
    return await supabase.auth.signInWithPassword({ 
      email: credentials.user, 
      password: credentials.password
    });
  };

  const signOut = () => {
    supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};
