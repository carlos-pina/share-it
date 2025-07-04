import { Link } from "react-router"
import { PostList } from "../components/PostList"

export const PostsPage = () => {
  return (
    <div className="pt-5">
      <div className="text-right">
        <Link to='/post/create' className="underline text-blue-500">Create a New Post ➡</Link>
      </div>
      <h2 className="text-6xl font-bold mb-6 text-center text-blue-500">
        Posts
      </h2>
      <div>
        <PostList />
      </div>
    </div>
  )
}