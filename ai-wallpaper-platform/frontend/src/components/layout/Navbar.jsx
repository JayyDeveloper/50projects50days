import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiSearch, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import useAuthStore from '../../store/authStore'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setShowUserMenu(false)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AW</span>
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              AI Wallpaper
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/gallery" className="text-gray-300 hover:text-white transition">
              Gallery
            </Link>
            <Link to="/pricing" className="text-gray-300 hover:text-white transition">
              Pricing
            </Link>
            <button className="text-gray-300 hover:text-white transition">
              <FiSearch size={20} />
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg py-2 animate-slide-down">
                    <Link
                      to="/account"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-white/10"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FiUser size={16} />
                      <span>Account</span>
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-white/10"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FiSettings size={16} />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-white/10 w-full text-left"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-600 to-pink-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-primary-500/50 transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/gallery"
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Account
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 bg-gradient-to-r from-primary-600 to-pink-600 text-white rounded-lg text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
