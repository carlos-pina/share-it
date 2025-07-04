import { Link, useParams } from "react-router";
import { GroupDisplay } from "../components/GroupDisplay";

export const GroupPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-5">
      <div className="flow-root">
        <Link to='/groups' className="underline text-blue-500 float-left">⬅ Back to Groups</Link>
        <Link to={{ pathname: "/post/create", search: `?groupId=${id}` }} className="underline text-blue-500 float-right">Create a Post ➡</Link>
      </div>
      <div className="pt-5">
        <GroupDisplay groupId={ Number(id) } />
      </div>
    </div>
  );
};