export type ThreadsType = {
  id: number;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  authorId: string; 
  author: {
    id: number;
    username: string;
    email: string;
    profile?: {
      avatarImage?: string;
    };
  };
  isLike?: boolean;
  _count?: {
    like?: number;
    replies?: number;
  };
};
