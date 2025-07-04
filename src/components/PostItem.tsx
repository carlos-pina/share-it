import { Link } from "react-router";
import { type Post } from "../lib/common";

interface Props {
    post: Post;
};

export const PostItem = ({ post }: Props) => {
  return (
    <div className="relative">
      <Link to={`/post/${post.id}`} className="block relative z-10">
        <div className="w-80 bg-gray-100 border border-gray-200 rounded-[20px] flex flex-col p-3 text-gray-400 overflow-hidden hover:-translate-y-1 transition transform hover:bg-gray-300">
          {/* Header Title */}  
          <div className="flex font-semibold p-1">
            { post.title }
          </div>
          {/* Image Banner */}
          <div className="flex mt-2">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full rounded-[20px] object-cover min-h-[200] max-h-[200px] mx-auto"
            />
          </div>
          <div className="flex mt-4 justify-around items-center">
            <span className="cursor-pointer px-1 flex items-center justify-center rounded-lg">
              ❤️ <span className="ml-2"> { post.like_count ?? 0 } </span>
            </span>
            <span className="cursor-pointer px-1 flex items-center justify-center rounded-lg">
              💬 <span className="ml-2"> { post.comment_count ?? 0 } </span>
            </span>
            <span>
              { post.user_name && (<span className="ml-2"> 👽 {post.user_name} </span>) }
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};