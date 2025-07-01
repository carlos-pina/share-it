import { useQuery } from "@tanstack/react-query";
import { type Post } from "../lib/common";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

interface Props {
  groupId: number;
}

interface PostWithGroup extends Post {
  groups: {
    name: string;
  };
}

export const fetchGroupPost = async (
  groupId: number
): Promise<PostWithGroup[]> => {
  const { data, error } = await supabase
    .from("posts_with_counts")
    .select("*, groups(name)")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  
  return data as PostWithGroup[];
};

export const GroupDisplay = ({ groupId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithGroup[], Error>({
    queryKey: ["groupPost", groupId],
    queryFn: () => fetchGroupPost(groupId),
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
            {data && data[0].groups.name} Group Posts
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