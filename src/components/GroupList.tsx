import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Group {
  id: number;
  name: string;
  description: string;
  created_at: string;
  user_name: string;
  post_count: number;
}

export const fetchGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from("groups_with_counts")
    .select("*");

  if (error) throw new Error(error.message);
  
  return data as Group[];
};

export const GroupList = () => {
  const { data, error, isLoading } = useQuery<Group[], Error>({
    queryKey: ["groups"],
    queryFn: fetchGroups,
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
    <div className="max-w-xl mx-auto space-y-4">
      {data?.map((group) => (
        <div
          key={ group.id }
          className="bg-gray-100 border border-gray-200 p-3 rounded-[20px] hover:-translate-y-1 transition transform hover:bg-gray-300"
        >
          <Link
            to={`/group/${ group.id }`}
            className="text-2xl font-bold text-blue-500 hover:underline"
          >
            { group.name }
          </Link>
          <p className="text-gray-400 mt-2">{ group.description }</p>
          <div className="flex justify-around items-center mt-2">
            <span className="flex items-center justify-center rounded-lg">
              👽 <span className="text-blue-500 ml-2">{ group.user_name }</span>
            </span>
            <span className="flex items-center justify-center rounded-lg">
              #️⃣ <span className="text-blue-500 ml-2">{ group.post_count }</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};