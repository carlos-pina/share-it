import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, communities(name)")
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  
  return data as PostWithCommunity[];
};

export const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading) {
    return (
      <div>
        <p className="text-xl font-bold pt-6 text-center text-yellow-500">Loading groups...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        Error: {error.message}
      </div>
    );
  }
  
  return (
    <div>
      {data && data.length > 0 ? (
        <div>
          <h2 className="text-6xl font-bold mb-6 text-center text-blue-500">
            {data && data[0].communities.name} Group Posts
          </h2>
          <div className="flex flex-wrap gap-6 justify-center">
            {data.map((post) => (
              <PostItem key={ post.id } post={ post } />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-6xl font-bold mb-6 text-center text-blue-500">
            Group Posts
          </h2>
          <p className="text-center text-gray-400">
            No posts in this group yet.
          </p>
        </div>
      )}
    </div>
  );
};