import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const onSignOut = () => {
    signOut().then((response) => {
      if (response && response.error) {
        throw new Error(response.error.message);
      } else {
        toggleMenuButton();
        navigate("/");
      }
    });
  }

  const toggleMenuButton = () => {
    setMenuOpen((prev) => !prev)
  }

  return (
    <nav className="fixed top-0 w-full z-40 bg-gradient-to-r from-blue-50 via-white to-blue-50 backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="font-mono text-2xl font-bold text-yellow-500">
            share<span className="text-blue-500">.it</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/posts"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              Posts
            </Link>
            <Link
              to="/groups"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              Groups
            </Link>
            {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/post/create"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                Create Post
              </Link>
              <Link
                to="/group/create"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                Create Group
              </Link>
            </div>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                {user.user_metadata?.display_name && (
                  <span className="text-gray-300">{ user.user_metadata.display_name }</span>
                )}
                <button
                  onClick={ onSignOut }
                  className="bg-red-500 px-3 py-1 text-xs rounded cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="bg-blue-500 px-3 py-1 text-xs rounded cursor-pointer"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 px-3 py-1 text-xs rounded cursor-pointer"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenuButton}
              className="text-gray-400 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/posts"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-300"
              onClick={toggleMenuButton}
            >
              Posts
            </Link>
            <Link
              to="/groups"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-300"
              onClick={toggleMenuButton}
            >
              Groups
            </Link>
            <Link
              to="/post/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-300"
              onClick={toggleMenuButton}
            >
              Create Post
            </Link>
            <Link
              to="/group/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-300"
              onClick={toggleMenuButton}
            >
              Create Group
            </Link>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.display_name && (
                  <span className="pl-5 pb-5 text-gray-300">{ user.user_metadata.display_name }</span>
                )}
                <button
                  onClick={ onSignOut }
                  className="bg-red-500 ml-2 mb-5 px-3 py-1 text-xs rounded cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="bg-blue-500 ml-5 mb-5 px-3 py-1 text-xs rounded cursor-pointer"
                  onClick={toggleMenuButton}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 ml-5 mb-5 px-3 py-1 text-xs rounded cursor-pointer"
                  onClick={toggleMenuButton}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
