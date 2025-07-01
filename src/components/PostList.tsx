import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";
import { type Post } from "../lib/common";

const fetchPosts = async () : Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts_with_counts")
    .select("*");
  
  if (error) throw new Error(error.message);

  return data as Post[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  if (isLoading) {
    return (
      <div> 
        <p className="text-xl font-bold pt-6 text-center text-yellow-500">Loading posts...</p>
      </div>
    )
  }

  if (error) {
    return <div> Error: {error.message} </div>
  }
  
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {data?.map((post, key) => (
        <PostItem post={post} key={key} />
      ))}
    </div>
  );
};