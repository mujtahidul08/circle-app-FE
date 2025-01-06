import {create} from 'zustand';
import axios from 'axios';
import { ReplyType } from '@/types/reply.types';
import { apiURL } from '@/utils/baseurl';

type ReplyState = {
    replies: ReplyType[];
    fetchReplies: (token: string, threadId: string) => void;
    addReply: (newReply: ReplyType) => void;
    clearReplies: () => void;
  };
  
  export const useReplyStore = create<ReplyState>((set) => ({
    replies: [],
    async fetchReplies(token, threadId) {
      try {
        const response = await axios.get(`${apiURL}api/thread/replies/${threadId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched replies:', response.data); 
        set({ replies: response.data });
      } catch (error) {
        console.error('Failed to fetch replies:', error);
      }
    },
    addReply: (newReply) => set((state) => ({ replies: [newReply, ...state.replies] })),
    clearReplies: () => set({ replies: [] }),
  }));