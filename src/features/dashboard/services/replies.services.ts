import { apiURL } from "@/utils/baseurl";

import axios, { AxiosResponse } from "axios";

export const createReply = async (
  content: string,
  token: string,
  file: File | null,
  threadId: string
) => {
  try {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("threadId", threadId);

    if (file) {
        
        console.log('File selected:', file); // Untuk memeriksa file yang dipilih
  
        formData.append("image", file); // Menambahkan file gambar yang dipilih
      }

    const res = await axios.post(
      apiURL + `api/thread/replies/${threadId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Response:", res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Something went wrong");
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
};

export const getAllReplies = async (token: string, threadId: string) => {
    try {
      const res: AxiosResponse = await axios.get(
        `${apiURL}api/thread/replies/${threadId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data; // Mengembalikan replies
    } catch (error) {
      console.error("Error fetching replies:", error);
  
      // Verifikasi tipe error
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Error fetching replies");
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  };
// export const getAllReplies = async (token: string, threadId: string) => {
//     try {
//       const res: AxiosResponse = await axios.get(apiURL + 'api/thread/replies/${threadId}', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         }
//       });
//       console.log('result', res);
//       return res.data.threads;  
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error('axios error', error.response?.data || error.message);
//         throw new Error(error.response?.data?.message || 'something went wrong');
//       } else {
//         console.error('unexpected error:', error);
//         throw error;
//       }
//     }
//   };
