import React, { createContext, useState } from "react";
import { userType } from "@/types/user.types";

export type UserContextType = {
  user: userType;
  setUser: (user: userType) => void;
};

export const UserContext = createContext<UserContextType>({
  user: {
    id: 0,
    username: "",
    email: "",
    profile: { bio: "", avatarImage: "" },
    followers: 0,
    following: 0,
  },
  setUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<userType>({
    id: 1,
    username: "mujtahidul",
    email: "mujtahidul@gmail.com",
    profile: { bio: "Bio default", avatarImage: "" },
    followers: 10,
    following: 5,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
