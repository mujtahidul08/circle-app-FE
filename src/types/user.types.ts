export interface userType {
  id: number;
  username: string;
  email: string;
  profile?: {
    bio?: string;
    avatarImage?: string;
    backgroundImage?: string;
  }|null;
  followers?: number;
  following?: number;
  isFollowed?: boolean;
  avatar?:string;
  image?:string;
};