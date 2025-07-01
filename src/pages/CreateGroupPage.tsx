import { CreateGroup } from "../components/CreateGroup";
import { useAuth } from "../context/AuthContext";

export const CreateGroupPage = () => {
  const { user } = useAuth();

  return (
    <div className="mt-6">
      { user ? (
        <div className="pt-20">
          <CreateGroup />
        </div>
      ) : (
        <div className="pt-20">
          <h2 className="text-4xl font-bold mb-6 text-center text-blue-500">
            Please, sign-in to share something!
          </h2>
        </div>
      )}
    </div>
  );
};