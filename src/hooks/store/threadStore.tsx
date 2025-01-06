import { create } from 'zustand';
import axios, { AxiosResponse } from 'axios';
import { apiURL } from '@/utils/baseurl';
import { ThreadsType } from '@/types/thread.types';

type ThreadState = {
  threads: ThreadsType[];
  currentThread: ThreadsType | null;
  fetchThreads: (token: string) => Promise<void>;
  clearThread: () => void;
  toggleLikeThread: (args: ToggleLikeThreadArgs) => void;  // Perbarui tipe parameter
  setThreads: (threads: ThreadsType[]) => void;
  setCurrentThread: (thread: ThreadsType) => void;
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
  clearThread() {
    set({ currentThread: null });
  },
  toggleLikeThread({ threadId, liked, likeCount }: ToggleLikeThreadArgs) {
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === threadId
          ? { 
              ...thread, 
              isLike: liked, 
              _count: { 
                ...thread._count, 
                like: likeCount 
              } 
            }
          : thread
      ),
    }));
  },
  setThreads: (threads) => set({ threads }),
  
  setCurrentThread: (thread) => set({ currentThread: thread }),
  
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