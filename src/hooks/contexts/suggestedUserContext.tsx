import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "@/hooks/store/userStore";
import { apiURL } from "@/utils/baseurl";

type SuggestedUser = {
  id: number;
  username: string;
  fullname: string;
  avatar: string;
  isFollow: boolean;
};

type SuggestedUserContextType = {
    suggestedUsers: SuggestedUser[];
    reloadSuggestedUsers: () => void; 
    handleFollowToggle: (userId: number) => Promise<void>; 
  };

const SuggestedUserContext = createContext<SuggestedUserContextType | undefined>(undefined);

export const SuggestedUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const { token } = useUserStore();

  const fetchSuggestedUsers = async () => {
    if (!token) {
      console.error("Token is not available");
      return;
    }

    try {
      const response = await axios.get(`${apiURL}api/profile/suggested`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuggestedUsers(response.data.users.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch suggested users", error);
    }
  };

  const handleFollowToggle = async (userId: number) => {
    if (!token) {
      console.error("Token is not available");
      return;
    }

    try {
      await axios.post(
        apiURL+`api/profile/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchSuggestedUsers();
    } catch (error) {
      console.error("Failed to toggle follow status", error);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, [token]); 

  return (
    <SuggestedUserContext.Provider
      value={{
        suggestedUsers,
        reloadSuggestedUsers: fetchSuggestedUsers,
        handleFollowToggle, 
      }}
    >
      {children}
    </SuggestedUserContext.Provider>
  );
};

export const useSuggestedUsers = () => {
  const context = useContext(SuggestedUserContext);
  if (!context) throw new Error("useSuggestedUsers must be used within a SuggestedUserProvider");
  return context;
};
