import { Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import { Navbar } from './components/Navbar'
import { CreatePostPage } from './pages/CreatePostPage'
import { PostPage } from './pages/PostPage'
import { CreateCommunityPage } from './pages/CreateCommunityPage'
import { CommunitiesPage } from './pages/CommunitiesPage'
import { CommunityPage } from './pages/CommunityPage'
import { SignInPage } from './pages/SignInPage'
import { SignUpPage } from './pages/SignUpPage'
import { VideoConvertPage } from './pages/VideoConvertPage'

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-100 transition-opacity duration-700 pt-10">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/post/create' element={<CreatePostPage />} />
          <Route path='/post/:id' element={<PostPage />} />
          <Route path='/communities' element={<CommunitiesPage />} />
          <Route path='/community/create' element={<CreateCommunityPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path='/convert' element={<VideoConvertPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
