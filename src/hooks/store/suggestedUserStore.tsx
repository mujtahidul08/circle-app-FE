import {create} from 'zustand';
import axios from 'axios';
import useUserStore from "@/hooks/store/userStore";
import { apiURL } from '@/utils/baseurl';

type SuggestedUser = {
  id: number;
  username: string;
  fullname: string;
  email:string;
  avatar: string;
  isFollow: boolean;
};

interface SuggestedUserStore {
  suggestedUsers: SuggestedUser[];
  fetchSuggestedUsers: () => Promise<void>;
  handleFollowToggle: (userId: number) => Promise<void>;
  reloadSuggestedUsers: () => void;
}

const useSuggestedUserStore = create<SuggestedUserStore>((set) => ({
  suggestedUsers: [],
  fetchSuggestedUsers: async () => {
    const { token } = useUserStore.getState(); // Mengambil token dari userStore
    if (!token) {
      console.error("Token is not available");
      return;
    }

    try {
      const response = await axios.get(apiURL+"api/profile/suggested", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ suggestedUsers: response.data.users.slice(0, 5) });
    } catch (error) {
      console.error("Failed to fetch suggested users", error);
    }
  },
  handleFollowToggle: async (userId: number) => {
    const { token } = useUserStore.getState();
    if (!token) {
      console.error("Token is not available");
      return;
    }

    try {
      await axios.post(apiURL+`api/profile/follow/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        suggestedUsers: state.suggestedUsers.map((user) =>
          user.id === userId ? { ...user, isFollow: !user.isFollow } : user
        ),
      }));
    } catch (error) {
      console.error("Failed to toggle follow status", error);
    }
  },
  reloadSuggestedUsers: () => set((state) => ({ suggestedUsers: [...state.suggestedUsers] })),
}));

export default useSuggestedUserStore;