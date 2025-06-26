import { Link } from "react-router";
import type { Post } from "./PostList";

interface Props {
    post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative">
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 h-70 bg-blue-500 border border-black rounded-[20px] text-white flex flex-col p-3 overflow-hidden hover:bg-blue-400">
          {/* Header: Avatar and Title */}
          <div className="flex items-center space-x-2">
            { post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="w-[35px] h-[35px] rounded-full object-cover"
              />
            ) : (
              <div className="w-[35px] h-[35px] rounded-full bg-gradient-to-tl from-red-500 to-yellow-500" />
            )}
            <div className="flex flex-col flex-1">
              <div className="text-[20px] leading-[22px] font-semibold mt-2">
                { post.title }
              </div>
            </div>
          </div>
        
          {/* Image Banner */}
          <div className="mt-4 flex-1">
            <img 
              src={post.image_url} 
              alt={post.image_url} 
              className="w-full rounded-[20px] object-cover max-h-[200px] mx-auto"
            />
          </div>
          <div className="flex justify-around items-center">
            <span className="cursor-pointer px-1 flex items-center justify-center font-extrabold rounded-lg">
              ❤️ <span className="ml-2"> { post.like_count ?? 0 } </span>
            </span>
            <span className="cursor-pointer px-1 flex items-center justify-center font-extrabold rounded-lg">
              💬 <span className="ml-2"> { post.comment_count ?? 0 } </span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};