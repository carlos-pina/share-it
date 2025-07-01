import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Group {
  id: number;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
}

export const fetchGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .order("created_at", { ascending: false });

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
    <div className="max-w-5xl mx-auto space-y-4">
      {data?.map((group) => (
        <div
          key={ group.id }
          className="border border-white/10 p-4 rounded hover:-translate-y-1 transition transform"
        >
          <Link
            to={`/group/${ group.id }`}
            className="text-2xl font-bold text-blue-500 hover:underline"
          >
            { group.name }
          </Link>
          <p className="text-gray-400 mt-2">{ group.description }</p>
        </div>
      ))}
    </div>
  );
};