import { Link } from "react-router";

export const HomePage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-20 text-center text-blue-500">
        SHARE IT!
      </h2>
      <div className="text-3xl font-bold text-center text-yellow-500">
        <div className="m-5">Let's share your awesome moments with the world in <span className="text-blue-500">GIFs!</span></div>
        <div className="m-5">Just convert your video-moments into GIFs-adventures!</div>
        <div className="m-5">Create a <Link to='group/create' className="underline text-blue-500">Group</Link> or make a <Link to='post/create' className="underline text-blue-500">Post</Link> directly.</div>
      </div>
    </div>
  );
};