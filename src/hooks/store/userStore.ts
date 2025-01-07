import { userType } from "@/types/user.types";
import { apiURL } from "@/utils/baseurl";
import axios from "axios";
import { create } from "zustand";

interface userState {
  user: userType | null;
  token: string | null;
  setUser: (user: userType) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  updateFollowers: (followers: number) => void;
  updateFollowing: (following: number) => void;
  updateProfile: (token: string, formData: FormData) => void;
  fetchProfile: (token: string) => void
}

const useUserStore = create<userState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token") || null,
  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  clearUser: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
  updateFollowers: (followers) =>
    set((state) => ({
      user: state.user ? { ...state.user, followers } : null,
    })),
  updateFollowing: (following) =>
    set((state) => ({
      user: state.user ? { ...state.user, following } : null,
    })),
    updateProfile: async (token: string, formData: FormData) => {
      try {
        const response = await axios.put(apiURL + "api/profile", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
    
        set((state) => ({
          user: state.user ? { ...state.user, profile: response.data.profile } : null,
        }));
    
        return response;
      } catch (error) {
        throw new Error("Failed to update profile");
      }
    },
    fetchProfile: async (token) => {
      try {
        const response = await axios.get(apiURL + "api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        set({ user: response.data }); // Update user secara langsung dengan response data
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        throw new Error("Failed to fetch profile");
      }
    },
}));
export default useUserStore;

