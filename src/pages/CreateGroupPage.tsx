import { Link } from "react-router";
import { CreateGroup } from "../components/CreateGroup";
import { useAuth } from "../context/AuthContext";

export const CreateGroupPage = () => {
  const { user } = useAuth();

  return (
    <div className="mt-6">
      { user ? (
        <>
          <div>
            <Link to='/groups' className="underline text-blue-500"> ⬅ Back to Groups</Link>
          </div>
          <div className="pt-5">
            <CreateGroup />
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