import { Link, useSearchParams } from "react-router";
import { CreatePost } from "../components/CreatePost";
import { useAuth } from "../context/AuthContext";

export const CreatePostPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get('groupId')

  return (
    <div className="mt-6">
      { user ? (
        <>
          <div>
            <Link to='/posts' className="underline text-blue-500"> ⬅ Back to Posts</Link>
          </div>
          <div className="pt-5">
            <CreatePost groupId={Number(groupId)} />
          </div>
        </>
      ) : (
        <div className="pt-20">
          <h2 className="text-4xl font-bold mb-6 text-center text-yellow-500">
            Please, <Link to="/signin" className="hover:underline text-blue-500">Sign-In</Link> to share something!
          </h2>
        </div>
      )}
    </div>
  );
};