import useFollowStore from "@/hooks/store/followStore";
import useUserStore from "@/hooks/store/userStore";
import {Follower, Following } from "@/types/profile.types";
import { apiURL } from "@/utils/baseurl";
import axios from "axios";

export const updateProfile = async (
  token: string,
  data: {
    username?: string;
    email?: string;
    bio?: string;
    avatarImage?: File | null;
    backgroundImage?: File | null;
  }
) => {
  const formData = new FormData();

  if (data.username) formData.append("username", data.username);
  if (data.email) formData.append("email", data.email);
  if (data.bio) formData.append("bio", data.bio);
  if (data.avatarImage) formData.append("avatarImage", data.avatarImage); // File
  if (data.backgroundImage) formData.append("backgroundImage", data.backgroundImage); // File

  const res = await axios.put(`${apiURL}api/profile/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// export const updateProfile = async (
//   token: string,
//   data: { username?: string; email?: string; bio?: string; avatarImage?: File; backgroundImage?: File }
// ) => {
//   try {
//     const formData = new FormData();

//     // Hanya tambahkan data yang relevan
//     if (data.bio) formData.append('bio', data.bio);
//     if (data.avatarImage) formData.append('avatarImage', data.avatarImage);
//     if (data.backgroundImage) formData.append('backgroundImage', data.backgroundImage);

//     const res = await axios.put(`${apiURL}api/profile`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return res.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || 'Something went wrong');
//     }
//     throw new Error('Unexpected error occurred');
//   }
// };

// export const updateProfile = async (
//   token: string,
//   data: { username?: string; email?: string; bio?: string; avatarImage?: File; backgroundImage?: File }
// ) => {
//   try {
//     const formData = new FormData();

//     // Tambahkan data teks ke FormData
//     if (data.username) formData.append('username', data.username);
//     if (data.email) formData.append('email', data.email);
//     if (data.bio) formData.append('bio', data.bio);

//     // Tambahkan file ke FormData
//     if (data.avatarImage) formData.append('avatarImage', data.avatarImage);
//     if (data.backgroundImage) formData.append('backgroundImage', data.backgroundImage);

//     const res = await axios.put(`${apiURL}api/profile`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     return res.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || 'Something went wrong');
//     }
//     throw new Error('Unexpected error occurred');
//   }
// };



export const getAllThreadsByUser = async (token: string) => {
  try {
    const response = await axios.get(`${apiURL}api/profile/user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Kirim token sebagai Bearer Authorization
      },
    });
    return response.data.threads; // Mengembalikan data threads
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};

export const fetchFollowers = async (token: string): Promise<Follower[]> => {
  try {
    const response = await axios.get<{ followers: Follower[] }>(
      "http://localhost:3000/api/profile/followers",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Kirim token dalam header
        },
      }
    );

    return response.data.followers;
  } catch (error) {
    console.error("Error fetching followers:", error);
    throw new Error("Failed to fetch followers");
  }
};

// export const fetchFollowers = async (token: string): Promise<Follower[]> => {
//   try {
//     const response = await axios.get(`${apiURL}api/profile/followers`, {
//       headers: {
//         Authorization: `Bearer ${token}`, 
//       },
//     });
    
//     const followers = response.data.followers.map((follower: any) => ({
//       id: follower.id,
//       fullname: follower.fullname,
//       username: `${follower.username}`,
//       image: follower.avatarImage || "https://bit.ly/naruto-sage",  
//       email: follower.email,  
//       isFollow: true,
//     }));
//     return followers;
//   } catch (error) {
//     console.error("Error fetching followers:", error);
//     throw error;
//   }
// };

// export const fetchFollowers = async (): Promise<Follower[]> => {
//   try {
//     const response = await axios.get(`${apiURL}api/profile/followers`); // Ganti dengan endpoint API yang sesuai
//     const followers = response.data.followers.map((follower: any) => ({
//       id: follower.id,              
//       fullname: follower.fullname,
//       username: `@${follower.username}`,
//       image: follower.image || "https://bit.ly/naruto-sage",
//       isFollow: true, // Sesuaikan jika backend memberikan informasi follow/unfollow
//     }));
//     return followers;
//   } catch (error) {
//     console.error("Error fetching followers:", error);
//     throw error;
//   }
// };

export const fetchFollowing = async (token: string): Promise<Follower[]> => {
  try {
    const response = await axios.get(`${apiURL}api/profile/following`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const following = response.data.following.map((user: any) => ({
      id: user.id,
      fullname: user.fullname,
      username: `${user.username}`,
      image: user.profile?.avatarImage || "https://bit.ly/naruto-sage", // Fallback image
      email: user.email,
      isFollow: true,
    }));
    return following;
  } catch (error) {
    console.error("Error fetching following:", error);
    throw error;
  }
};

// export const fetchFollowing = async (): Promise<Following[]> => {
//   try {
//     const response = await axios.get("api/profile/following"); // Ganti dengan endpoint API backend Anda
//     const following = response.data.following.map((user: any) => ({
//       id: user.id,
//       fullname: user.fullname,
//       username: `@${user.username}`,
//       image: user.image || "https://bit.ly/naruto-sage",
//       isFollow: true, // Karena ini adalah daftar yang sedang diikuti
//     }));
//     return following;
//   } catch (error) {
//     console.error("Error fetching following:", error);
//     throw error;
//   }
// };

export const getAllByAccount = async (authorId: string, token: string) => {
  try {
    const response = await axios.get(`${apiURL}api/profile/account/${authorId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Kirim token sebagai Bearer Authorization
      },
    });
    return response.data.threads; // Mengembalikan data threads
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};


async function fetchSuggestedUsers() {
  const { token } = useUserStore.getState();
  console.log("Token:", token);
  if (!token) {
    console.error("Token is not available");
    return;
  }
  try {
    const response = await axios.get(apiURL + "api/profile/suggested", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Suggested Users API Response:", response.data.users);
    useFollowStore.getState().updateData({ suggestedUsers: response.data.users.slice(0, 5) });
  } catch (error) {
    console.error("Failed to fetch suggested users", error);
  }
}

export default fetchSuggestedUsers

export const toggleFollow = async (token: string, userId: number) => {
  try {
    const response = await axios.post(
      `${apiURL}api/profile/follow/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Kirim token sebagai Bearer Authorization
        },
      }
    );
    console.log("Suggested Users Response:", response.data); 

    return response.data; // Mengembalikan data dari respons API
  } catch (error) {
    console.error("Error toggling follow:", error);
    throw error; // Lempar error agar dapat ditangani di tempat lain
  }
};