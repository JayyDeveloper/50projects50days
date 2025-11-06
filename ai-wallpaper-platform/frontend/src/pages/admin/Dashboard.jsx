import { useEffect, useState } from 'react'
import { FiUsers, FiImage, FiDownload, FiDollarSign } from 'react-icons/fi'
import { adminAPI } from '../../utils/api'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="text-primary-400 text-2xl" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.overview?.totalUsers || 0}
            </p>
            <p className="text-gray-400 text-sm">Users</p>
            <p className="text-green-400 text-xs mt-2">
              +{stats?.overview?.newUsersThisMonth || 0} this month
            </p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <FiImage className="text-pink-400 text-2xl" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.overview?.totalWallpapers || 0}
            </p>
            <p className="text-gray-400 text-sm">Wallpapers</p>
            <p className="text-yellow-400 text-xs mt-2">
              {stats?.overview?.pendingWallpapers || 0} pending
            </p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <FiDownload className="text-purple-400 text-2xl" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.overview?.totalDownloads || 0}
            </p>
            <p className="text-gray-400 text-sm">Downloads</p>
            <p className="text-green-400 text-xs mt-2">
              +{stats?.overview?.downloadsThisMonth || 0} this month
            </p>
          </div>

          <div className="glass p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <FiDollarSign className="text-green-400 text-2xl" />
              <span className="text-xs text-gray-400">Active</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {stats?.overview?.activeSubscriptions || 0}
            </p>
            <p className="text-gray-400 text-sm">Subscriptions</p>
          </div>
        </div>

        {/* Top Wallpapers */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Top Wallpapers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats?.topWallpapers?.slice(0, 5).map((wallpaper) => (
              <div key={wallpaper._id} className="relative">
                <img
                  src={wallpaper.images?.thumbnail?.url}
                  alt={wallpaper.title}
                  className="w-full aspect-[3/4] object-cover rounded-lg"
                />
                <div className="mt-2">
                  <p className="text-white text-sm font-medium line-clamp-1">
                    {wallpaper.title}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {wallpaper.stats?.downloads || 0} downloads
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Breakdown */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Subscription Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats?.subscriptionBreakdown?.map((item) => (
              <div key={item._id} className="bg-white/5 p-4 rounded-lg">
                <p className="text-gray-400 text-sm capitalize mb-1">{item._id} Plan</p>
                <p className="text-2xl font-bold text-white">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
