import {create} from "zustand";

interface profileState {
    username: string | null;
    email: string | null;
    bio: string | null;
    avatarImage: string | null;
    backgroundImage: string | null;
    updateUsername: (username: string) => void;
    updateEmail: (email: string) => void;
    updateBio: (bio: string) => void;
    updateAvatarImage: (image: string) => void;
    updateBackgroundImage: (image: string) => void;
  }
  
  const useProfileStore = create<profileState>((set) => ({
    username: null,
    email: null,
    bio: null,
    avatarImage: null,
    backgroundImage: null,
    updateUsername: (username) => set({ username }),
    updateEmail: (email) => set({ email }),
    updateBio: (bio) => set({ bio }),
    updateAvatarImage: (image) => set({ avatarImage: image }),
    updateBackgroundImage: (image) => set({ backgroundImage: image }),
    updateUser: (user:any) => set(user), // Tambahkan fungsi untuk update semua data user
  }));
  export default useProfileStore;