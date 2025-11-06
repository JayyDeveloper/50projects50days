import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiDownload, FiHeart, FiCreditCard, FiUser } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import { subscriptionAPI, authAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Account = () => {
  const { user, updateUser } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await subscriptionAPI.getStatus()
      setSubscription(response.data.data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return

    try {
      await subscriptionAPI.cancel()
      toast.success('Subscription cancelled')
      fetchSubscriptionStatus()
    } catch (error) {
      toast.error('Failed to cancel subscription')
    }
  }

  const handleResumeSubscription = async () => {
    try {
      await subscriptionAPI.resume()
      toast.success('Subscription resumed')
      fetchSubscriptionStatus()
    } catch (error) {
      toast.error('Failed to resume subscription')
    }
  }

  const getPlanBadgeColor = (plan) => {
    const colors = {
      free: 'bg-gray-500',
      basic: 'bg-blue-500',
      pro: 'bg-purple-500',
      enterprise: 'bg-pink-500'
    }
    return colors[plan] || 'bg-gray-500'
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">
            My Account
          </h1>
          <p className="text-gray-400">Manage your profile and subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{user?.name}</h3>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 ${getPlanBadgeColor(user?.subscription?.plan)} text-white text-xs font-semibold rounded-full uppercase`}>
                  {user?.subscription?.plan}
                </span>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'overview' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <FiUser className="inline mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'favorites' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <FiHeart className="inline mr-2" />
                  Favorites
                </button>
                <button
                  onClick={() => setActiveTab('downloads')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'downloads' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <FiDownload className="inline mr-2" />
                  Downloads
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    activeTab === 'subscription' ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <FiCreditCard className="inline mr-2" />
                  Subscription
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Account Statistics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary-600/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Total Downloads</p>
                      <p className="text-3xl font-bold text-white">{user?.downloadHistory?.length || 0}</p>
                    </div>
                    <div className="bg-pink-600/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Favorites</p>
                      <p className="text-3xl font-bold text-white">{user?.favorites?.length || 0}</p>
                    </div>
                    <div className="bg-purple-600/20 rounded-lg p-4">
                      <p className="text-gray-400 text-sm mb-1">Member Since</p>
                      <p className="text-lg font-bold text-white">
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm">Name</label>
                      <p className="text-white font-medium">{user?.name}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Email</label>
                      <p className="text-white font-medium">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Newsletter</label>
                      <p className="text-white font-medium">
                        {user?.newsletterSubscribed ? 'Subscribed' : 'Not subscribed'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">My Favorites</h2>
                {user?.favorites?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {user.favorites.map((wallpaper) => (
                      <Link
                        key={wallpaper._id}
                        to={`/wallpaper/${wallpaper.slug}`}
                        className="aspect-[3/4] rounded-lg overflow-hidden image-hover"
                      >
                        <img
                          src={wallpaper.images?.thumbnail?.url}
                          alt={wallpaper.title}
                          className="w-full h-full object-cover"
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiHeart size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No favorites yet</p>
                    <Link
                      to="/gallery"
                      className="inline-block mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                      Browse Gallery
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'downloads' && (
              <div className="glass rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Download History</h2>
                {user?.downloadHistory?.length > 0 ? (
                  <div className="space-y-4">
                    {user.downloadHistory.slice(0, 10).map((download, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={download.wallpaper?.images?.thumbnail?.url}
                            alt={download.wallpaper?.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="text-white font-medium">{download.wallpaper?.title}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(download.downloadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-primary-600/20 text-primary-400 rounded">
                          {download.license}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiDownload size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400">No downloads yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Subscription Details</h2>
                  {subscription && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm">Current Plan</label>
                        <p className="text-white font-medium text-xl capitalize">
                          {subscription.subscription?.plan}
                        </p>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm">Status</label>
                        <p className="text-white font-medium capitalize">
                          {subscription.subscription?.status}
                        </p>
                      </div>
                      {subscription.subscription?.currentPeriodEnd && (
                        <div>
                          <label className="text-gray-400 text-sm">Next Billing Date</label>
                          <p className="text-white font-medium">
                            {new Date(subscription.subscription.currentPeriodEnd).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="glass rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Manage Subscription</h2>
                  {user?.subscription?.plan !== 'free' ? (
                    <div className="space-y-4">
                      {subscription?.subscription?.cancelAtPeriodEnd ? (
                        <>
                          <p className="text-yellow-400 mb-4">
                            Your subscription will be cancelled at the end of the billing period.
                          </p>
                          <button
                            onClick={handleResumeSubscription}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            Resume Subscription
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleCancelSubscription}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Cancel Subscription
                        </button>
                      )}
                      <Link
                        to="/pricing"
                        className="block px-6 py-2 text-center glass text-white rounded-lg hover:bg-white/10 transition"
                      >
                        Change Plan
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/pricing"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition"
                    >
                      Upgrade to Premium
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
