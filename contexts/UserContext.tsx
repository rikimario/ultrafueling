"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type UserContextType = {
  user: any;
  avatarUrl: string | null;
  updateAvatar: (url: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: any;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.user_metadata?.picture || null
  );

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
