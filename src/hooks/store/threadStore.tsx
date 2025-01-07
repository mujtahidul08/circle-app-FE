import { create } from 'zustand';
import axios from 'axios';
import { apiURL } from '@/utils/baseurl';
import { ThreadsType } from '@/types/thread.types';

type ThreadState = {
  threads: ThreadsType[];
  currentThread: ThreadsType | null;
  fetchThreads: (token: string) => Promise<void>;
  fetchThreadDetail: (id: string) => Promise<void>;
  clearThread: () => void;
  toggleLikeThread: (args: ToggleLikeThreadArgs) => void;  
  setThreads: (threads: ThreadsType[]) => void;
  setCurrentThread: (thread: ThreadsType) => void;
  deleteThread:(threadId: number, token: string)  => void;
  updateThread: (threadId: number, formData: FormData, token: string) => void;
};

type ToggleLikeThreadArgs = {
  threadId: string;
  liked: boolean;
  likeCount: number;
};

export const useThreadStore = create<ThreadState>((set) => ({
  threads: [],
  currentThread: null,
  async fetchThreads(token) {
    try {
      const response = await axios.get(apiURL + 'api/thread', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched replies:', response.data); 
      // Hanya set threads dari response.data.threads
      set({ threads: response.data.threads });
    } catch (error) {
      console.error('Failed to fetch threads:', error);
    }
  },
  async fetchThreadDetail(id: string) {
    try {
      const response = await axios.get(`${apiURL}api/thread/${id}`);
      set({ currentThread: response.data.thread });
    } catch (error) {
      console.error('Failed to fetch thread detail:', error);
    }
  },
  clearThread() {
    set({ currentThread: null });
  },

  toggleLikeThread({ threadId, liked, likeCount }: ToggleLikeThreadArgs) {
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === Number(threadId)
          ? {
              ...thread,
              isLike: liked,
              _count: { ...thread._count, like: likeCount },
            }
          : thread
      ),
      currentThread:
        state.currentThread?.id === Number(threadId)
          ? {
              ...state.currentThread,
              isLike: liked,
              _count: { ...state.currentThread._count, like: likeCount },
            }
          : state.currentThread,
    }));
  },
  // toggleLikeThread({ threadId, liked, likeCount }: ToggleLikeThreadArgs) {
  //   set((state) => ({
  //     threads: state.threads.map((thread) =>
  //       thread.id === Number(threadId)
  //         ? {
  //             ...thread,
  //             isLike: liked,
  //             _count: {
  //               ...thread._count,
  //               like: likeCount,
  //             },
  //           }
  //         : thread
  //     ),
  //     currentThread: state.currentThread?.id === Number(threadId)
  //       ? {
  //           ...state.currentThread,
  //           isLike: liked,
  //           _count: {
  //             ...state.currentThread._count,
  //             like: likeCount,
  //           },
  //         }
  //       : state.currentThread,
  //   }));
  // },

  // toggleLikeThread({ threadId, liked, likeCount }: ToggleLikeThreadArgs) {
  //   set((state) => ({
  //     threads: state.threads.map((thread) =>
  //       thread.id === Number(threadId)
  //         ? { 
  //             ...thread, 
  //             isLike: liked, 
  //             _count: { 
  //               ...thread._count, 
  //               like: likeCount 
  //             } 
  //           }
  //         : thread
  //     ),
  //   }));
  // },
  setThreads: (threads) => set({ threads }),
  
  setCurrentThread: (thread) => set({ currentThread: thread }),
  async deleteThread(threadId: number, token: string) {
    try {
      await axios.delete(`${apiURL}api/thread/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        threads: state.threads.filter((thread) => thread.id !== threadId),
      }));
    } catch (error) {
      console.error("Failed to delete thread:", error);
      throw error;
    }
  },
  updateThread: async (threadId: number, formData: FormData, token: string) => {
    try {
      const response = await axios.put(`${apiURL}api/thread/${threadId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state) => ({
        threads: state.threads.map((thread) =>
          thread.id === threadId ? response.data.thread : thread
        ),
      }));
    } catch (error) {
      console.error('Failed to update thread:', error);
      throw error;
    }
  }
}));

//=====
// interface ThreadState {
//   threads: ThreadsType[];
//   setThreads: (threads: ThreadsType[]) => void;
//   clearThreads: () => void;
//   fetchThreads: (token: string) => Promise<void>;
//   toggleLikeThread: (threadId: number, liked: boolean, likeCount: number) => void;
// }

// const useThreadStore = create<ThreadState>((set) => ({
//   threads: [],

//   setThreads: (threads) => set({ threads }),

//   clearThreads: () => set({ threads: [] }),

//   fetchThreads: async (token) => {
//     try {
//       const res = await axios.get('http://localhost:3000/api/thread', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       set({ threads: res.data.threads });
//     } catch (error) {
//       console.error('Error fetching threads:', error);
//     }
//   },

//   toggleLikeThread: (threadId, liked, likeCount) => {
//     set((state) => ({
//       threads: state.threads.map((thread) =>
//         thread.id === threadId
//           ? {
//               ...thread,
//               isLike: liked,
//               _count: {
//                 ...thread._count,
//                 like: likeCount,
//               },
//             }
//           : thread
//       ),
//     }));
//   },
// }));

// export default useThreadStore;

//=========
// const useThreadStore = create<ThreadState>((set) => ({
//   threads: [],

//   fetchThreads: async (token) => {
//     try {
//       const res = await axios.get('http://localhost:3000/api/thread', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       set({ threads: res.data.threads });
//     } catch (error) {
//       console.error('Error fetching threads:', error);
//     }
//   },

//   toggleLikeThread: (threadId, liked, likeCount) => {
//     set((state) => ({
//       threads: state.threads.map((thread) =>
//         thread.id === threadId
//           ? {
//               ...thread,
//               isLike: liked,
//               _count: {
//                 ...thread._count,
//                 like: likeCount,
//               },
//             }
//           : thread
//       ),
//     }));
//   },
// }));

// export default useThreadStore;