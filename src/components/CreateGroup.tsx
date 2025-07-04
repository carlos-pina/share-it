import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface GroupInput {
  name: string;
  description: string;
  user_id: string;
}

const createGroup = async (group: GroupInput) => {
  const { data, error } = await supabase
    .from("groups")
    .insert(group);

  if (error) throw new Error(error.message);
  
  return data;
};

export const CreateGroup = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      navigate("/groups");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) throw new Error("You must be logged in to create a group!");
    mutate({ name, description, user_id: user?.id });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 text-gray-400">
      <h2 className="text-6xl font-bold mb-6 text-center text-blue-500">
        Create New Group
      </h2>
      <div>
        <label htmlFor="name" className="block mb-2 font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray/10 bg-transparent p-2 rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray/10 bg-transparent p-2 rounded"
          rows={2}
        />
      </div>
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          {isPending ? "Creating..." : "Create Group"}
        </button>
      </div>
      {isError && <p className="text-red-500">Error creating group.</p>}
    </form>
  );
};