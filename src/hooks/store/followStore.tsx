import { userType } from "@/types/user.types";
import { apiURL } from "@/utils/baseurl";
import axios from "axios";
import { create } from "zustand";
import useUserStore from "./userStore";

interface FollowStore {
  suggestedUsers: userType[];
  followers: userType[];
  following: userType[];
  followersCount: number;
  followingCount: number;
  fetchSuggestedUsers: () => Promise<void>;
  toggleFollow: (userId: number, token: string) => Promise<void>;
  updateCounts: () => void;
  fetchFollowCounts: () => Promise<void>;
  updateData: (data: {
    suggestedUsers?: userType[];
    followers?: userType[];
    following?: userType[];
  }) => void;
  updateFollowers: (followers: userType[]) => void;
  updateFollowing: (following: userType[]) => void;
}

const useFollowStore = create<FollowStore>((set, get) => ({
  suggestedUsers: [],
  followers: [],
  following: [],
  followersCount: 0,
  followingCount: 0,

  fetchSuggestedUsers: async () => {
    const { token } = useUserStore.getState();
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
      set({ suggestedUsers: response.data.users.slice(0, 5) });
    } catch (error) {
      console.error("Failed to fetch suggested users", error);
    }
  },

  toggleFollow: async (userId, token) => {
    try {
      const response = await axios.post(
        `${apiURL}api/profile/follow/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const { followed } = response.data;
  
      set((state) => {
        const updatedSuggestedUsers = state.suggestedUsers.map((user) =>
          user.id === userId ? { ...user, isFollowed: followed } : user
        );
  
        const updatedFollowing = followed
          ? [...state.following, state.suggestedUsers.find((user) => user.id === userId)!]
          : state.following.filter((user) => user.id !== userId);
  
        return {
          suggestedUsers: updatedSuggestedUsers,
          following: updatedFollowing,
        };
      });
  
      await get().fetchFollowCounts(); 
      get().updateCounts(); // Perbarui jumlah setelah fetch
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  },

  updateCounts: () =>
    set((state) => ({
      followersCount: state.followers.length,
      followingCount: state.following.length,
    })),

  fetchFollowCounts: async () => {
    const { token } = useUserStore.getState();
    if (!token) {
      console.error("Token is not available");
      return;
    }

    try {
      const [followersResponse, followingResponse] = await Promise.all([
        axios.get(`${apiURL}api/profile/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${apiURL}api/profile/following`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      set({
        followersCount: followersResponse.data.followers.length || 0,
        followingCount: followingResponse.data.following.length || 0,
      });
    } catch (error) {
      console.error("Error fetching follow counts", error);
    }
  },

  updateData: (data) => {
    console.log("Updating data in store:", data);
    set((state) => ({ ...state, ...data }));
  },

  updateFollowers: (followers) => set({ followers }),
  updateFollowing: (following) => set({ following }),
}));

export default useFollowStore;