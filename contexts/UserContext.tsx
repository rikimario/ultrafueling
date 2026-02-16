"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { createClient } from "@/utils/supabase/client";

type UserContextType = {
  user: any;
  avatarUrl: string | null;
  updateAvatar: (url: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: any;
}) {
  const supabase = createClient();
  const [user, setUser] = useState(initialUser);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initialUser?.user_metadata?.picture || null,
  );

  // ✅ Listen for auth state changes
  useEffect(() => {
    // Set up auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setAvatarUrl(session?.user?.user_metadata?.picture || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Update avatar when user changes
  useEffect(() => {
    setAvatarUrl(user?.user_metadata?.picture || null);
  }, [user?.id, user?.user_metadata?.picture]);

  const updateAvatar = (url: string) => {
    setAvatarUrl(url);
  };

  return (
    <UserContext.Provider value={{ user, avatarUrl, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
