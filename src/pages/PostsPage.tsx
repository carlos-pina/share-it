import { PostList } from "../components/PostList"

export const PostsPage = () => {
  return (
    <div className="pt-20">
      <h2 className="text-6xl font-bold mb-6 text-center text-blue-500">
        Posts
      </h2>
      <div>
        <PostList />
      </div>
    </div>
  )
}