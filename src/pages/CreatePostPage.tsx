import { CreatePost } from "../components/CreatePost";
import { useAuth } from "../context/AuthContext";

export const CreatePostPage = () => {
  const { user } = useAuth();

  return (
    <div className="mt-6">
      { user ? (
        <div className="pt-20">
          <CreatePost />
        </div>
      ) : (
        <div className="pt-20">
          <h2 className="text-4xl font-bold mb-6 text-center text-purple-500">
            Please, sign-in to share something!
          </h2>
        </div>
      )}
    </div>
  );
};