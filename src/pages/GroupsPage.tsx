import { Link } from "react-router";
import { GroupList } from "../components/GroupList";

export const GroupsPage = () => {
  return (
    <div className="pt-5">
      <div className="text-right">
        <Link to='/group/create' className="underline text-blue-500">Create a New Group ➡</Link>
      </div>
      <h2 className="text-6xl font-bold mb-6 text-center text-blue-500">
        Groups
      </h2>
      <GroupList />
    </div>
  );
};