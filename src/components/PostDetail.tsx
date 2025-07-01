import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { type Post } from "../lib/common";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Props {
    postId: number;
}

const fetchPostById = async (id: number) : Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId)
  });

  if (isLoading) {
    return (
      <div> 
        <p className="text-xl font-bold pt-6 text-center text-yellow-500">Loading post...</p>
      </div>
    )
  }

  if (error) {
    return <div> Error: {error.message} </div>
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-4xl font-bold mb-6 text-center text-blue-500">
        {data?.title}
      </h2>
      {data?.gif_url && (
        <img
          src={data.gif_url}
          alt={data?.title}
          className="mt-4 rounded object-contain w-full h-64"
        />
      )}
      <p className="text-gray-400">{data?.content}</p>
      <p className="text-gray-500 text-sm">
        Posted on: {new Date(data!.created_at).toLocaleDateString()}
      </p>

      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
};