import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { CommentItem } from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  parent_comment_id: number;
  content: string;
  user_id: string;
  users: {
    name: string;
  }
  created_at: string;
}

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string
) => {
  if (!userId) {
    throw new Error("You must to be logged in to comment.");
  }

  const { error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      content: newComment.content,
      parent_comment_id: newComment.parent_comment_id || null,
      user_id: userId
    })

  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
      .from("comments")
      .select("*, users(name)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    
  if (error) throw new Error(error.message);
  return data as Comment[];
};

export const CommentSection = ({ postId }: Props) => {
  const [ commentText, setCommentText ] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments, isLoading, error } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 60000
  });
  
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) => 
      createComment(
        newComment,
        postId,
        user?.id
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setCommentText("");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentText) return;

    mutate({ content: commentText, parent_comment_id: null });
  };

  const buildCommentTree = (
    flatComments: Comment[]
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });
    
    return roots;
  };

  const commentTree = comments ? buildCommentTree(comments) : [];

  if (isLoading) {
    return (
      <div>
        <p className="text-xl font-bold pt-6 text-center text-yellow-500">Loading comments...</p>
      </div>
    )
  }

  if (error) {
    return <div> Error: {error.message} </div>
  }

  return (
    <div className="mt-6 text-gray-400">
      <h3 className="text-2xl font-semibold mb-4"> Comments </h3>

      { /* Create Comment Section */ }
      { user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            className="w-full border border-gray/10 bg-transparent p-2 rounded"
            value={ commentText }
            rows={ 3 }
            placeholder="Write a comment..."
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            disabled={ !commentText }
          >
            { isPending ? "Posting..." : "Post Comment" }
          </button>
          {isError && (
            <p className="text-red-500 mt-2">Error posting comment.</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-gray-600">
          You must be logged in to post a comment.
        </p>
      )}

      { /* Comment Display Section */ }
      <div>
        { commentTree.map((comment, key) => (
          <CommentItem key={ key } comment={ comment } postId={ postId } />
        ))}
      </div>
    </div>
  );
};