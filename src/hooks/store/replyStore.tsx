import {create} from 'zustand';
import axios from 'axios';
import { ReplyType } from '@/types/reply.types';
import { apiURL } from '@/utils/baseurl';

type ReplyState = {
    replies: ReplyType[];
    fetchReplies: (token: string, threadId: string) => void;
    toggleLikeReply: (replyId: number, liked: boolean) => void;
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
    toggleLikeReply(replyId, liked) {
      set((state) => ({
        replies: state.replies.map((reply) =>
          reply.id === replyId ? { ...reply, isLike: liked, likeCount: (reply.likeCount || 0) + (liked ? 1 : -1) } : reply
        ),
      }));
    },
    addReply: (newReply) => set((state) => ({ replies: [newReply, ...state.replies] })),
    clearReplies: () => set({ replies: [] }),
  }));