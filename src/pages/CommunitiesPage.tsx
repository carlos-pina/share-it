import { CommunityList } from "../components/CommunityList";

export const CommunitiesPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center text-blue-500">
        Communities
      </h2>
      <CommunityList />
    </div>
  );
};