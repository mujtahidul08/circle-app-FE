export type ReplyType = {
  id: number;
  content: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  likes: Array<string>;
  replies: Array<string>;
  isLike: boolean;
  likeCount?: number;
  author: {
    username: string;
    email: string;
    profile: {
      avatarImage?: string; 
    };
  };
};