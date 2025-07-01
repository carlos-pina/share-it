import type { AuthError, AuthResponse, AuthTokenResponsePassword, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";

interface Credentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  signUp: (credentials: Credentials, name: string) => Promise<AuthResponse>;
  signIn: (credentials: Credentials) => Promise<AuthTokenResponsePassword>;
  signOut: () => Promise<{error: AuthError | null}>;
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

  const signUp = async (credentials: Credentials, name: string): Promise<AuthResponse> => {
    return await supabase.auth.signUp({
      email: credentials.email, 
      password: credentials.password,
      options: {
        data: { display_name: name },
      },
    });
  };

  const signIn = async (credentials: Credentials): Promise<AuthTokenResponsePassword> => {
    return await supabase.auth.signInWithPassword({ 
      email: credentials.email, 
      password: credentials.password
    });
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    return await supabase.auth.signOut();
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
