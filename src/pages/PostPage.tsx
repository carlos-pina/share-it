import { useParams } from "react-router";
import { PostDetail } from "../components/PostDetail";

export const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="pt-5">
      <PostDetail postId={ Number(id) } />
    </div>
  );
};