export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  gif_url: string;
  group_id: number;
  user_name: string;
  users: {
    name: string
  };
  like_count: number;
  comment_count: number;
};

export interface VideoMetadata {
  duration: string,
  size: number,
  width: number,
  height: number
};

export interface gapData {
  from: string,
  to: string
}