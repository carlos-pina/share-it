import { Route, Routes } from 'react-router'
import { PostsPage } from './pages/PostsPage'
import { Navbar } from './components/Navbar'
import { CreatePostPage } from './pages/CreatePostPage'
import { PostPage } from './pages/PostPage'
import { CreateGroupPage } from './pages/CreateGroupPage'
import { GroupsPage } from './pages/GroupsPage'
import { GroupPage } from './pages/GroupPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 text-gray-100 transition-opacity duration-700 pt-10">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/posts' element={<PostsPage />} />
          <Route path='/post/create' element={<CreatePostPage />} />
          <Route path='/post/:id' element={<PostPage />} />
          <Route path='/groups' element={<GroupsPage />} />
          <Route path='/group/create' element={<CreateGroupPage />} />
          <Route path="/group/:id" element={<GroupPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
