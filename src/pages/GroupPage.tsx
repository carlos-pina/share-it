import { useParams } from "react-router";
import { GroupDisplay } from "../components/GroupDisplay";

export const GroupPage = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="pt-20">
      <GroupDisplay groupId={ Number(id) } />
    </div>
  );
};