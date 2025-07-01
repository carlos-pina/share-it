import { GroupList } from "../components/GroupList";

export const GroupsPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center text-blue-500">
        Groups
      </h2>
      <GroupList />
    </div>
  );
};