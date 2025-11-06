import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiDownload, FiHeart, FiEye, FiArrowLeft, FiInfo } from 'react-icons/fi'
import { wallpaperAPI } from '../utils/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const WallpaperDetail = () => {
  const { slug } = useParams()
  const { isAuthenticated, user } = useAuthStore()
  const [wallpaper, setWallpaper] = useState(null)
  const [canDownload, setCanDownload] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchWallpaper()
  }, [slug])

  const fetchWallpaper = async () => {
    try {
      const response = await wallpaperAPI.getOne(slug)
      setWallpaper(response.data.data.wallpaper)
      setCanDownload(response.data.data.canDownloadOriginal)
      setIsFavorited(response.data.data.isFavorited)
    } catch (error) {
      console.error('Error fetching wallpaper:', error)
      toast.error('Failed to load wallpaper')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to download')
      return
    }

    if (!canDownload) {
      toast.error('Active subscription required')
      return
    }

    try {
      const response = await wallpaperAPI.download(wallpaper._id, 'personal')
      const { downloadUrl, filename } = response.data.data

      // Trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success('Download started!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Download failed')
    }
  }

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites')
      return
    }

    try {
      const response = await wallpaperAPI.toggleFavorite(wallpaper._id)
      setIsFavorited(response.data.data.isFavorited)
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (!wallpaper) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Wallpaper not found</h2>
          <Link to="/gallery" className="text-primary-400 hover:text-primary-300">
            Back to Gallery
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/gallery"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition mb-8"
        >
          <FiArrowLeft />
          <span>Back to Gallery</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl aspect-[3/4] glass">
              <img
                src={wallpaper.images?.preview?.url || '/placeholder.jpg'}
                alt={wallpaper.title}
                className="w-full h-full object-cover"
                onClick={() => setShowModal(true)}
              />
              {wallpaper.images?.preview?.watermarked && !canDownload && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <p className="text-white text-lg font-semibold">
                    Subscribe to download without watermark
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleDownload}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition flex items-center justify-center space-x-2"
              >
                <FiDownload />
                <span>Download</span>
              </button>
              <button
                onClick={handleFavorite}
                className={`py-3 px-6 rounded-lg font-semibold transition flex items-center justify-center space-x-2 ${
                  isFavorited
                    ? 'bg-pink-600 text-white'
                    : 'glass text-gray-300 hover:bg-white/10'
                }`}
              >
                <FiHeart className={isFavorited ? 'fill-current' : ''} />
                <span>{wallpaper.stats?.favorites || 0}</span>
              </button>
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              {wallpaper.title}
            </h1>

            <div className="flex items-center space-x-6 text-gray-400 mb-6">
              <span className="flex items-center space-x-2">
                <FiEye />
                <span>{wallpaper.stats?.views || 0} views</span>
              </span>
              <span className="flex items-center space-x-2">
                <FiDownload />
                <span>{wallpaper.stats?.downloads || 0} downloads</span>
              </span>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {wallpaper.categories?.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/gallery/${cat.slug}`}
                  className="px-4 py-2 glass rounded-full text-sm hover:bg-white/10 transition"
                  style={{ borderColor: cat.color }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Description */}
            <div className="glass p-6 rounded-xl mb-6">
              <h3 className="text-xl font-bold mb-3 text-white">Description</h3>
              <p className="text-gray-300">{wallpaper.description}</p>
            </div>

            {/* AI Model Info */}
            <div className="glass p-6 rounded-xl mb-6">
              <h3 className="text-xl font-bold mb-3 text-white">AI Model</h3>
              <p className="text-gray-300 mb-2">
                <strong>Model:</strong> {wallpaper.aiModel?.name}
              </p>
              {wallpaper.aiModel?.version && (
                <p className="text-gray-300">
                  <strong>Version:</strong> {wallpaper.aiModel.version}
                </p>
              )}
            </div>

            {/* Copyright Info */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <FiInfo className="text-primary-400" />
                <h3 className="text-xl font-bold text-white">Copyright & License</h3>
              </div>
              <p className="text-gray-300 mb-2">
                <strong>Owner:</strong> {wallpaper.copyright?.owner}
              </p>
              <p className="text-gray-300 mb-2">
                <strong>License:</strong> {wallpaper.copyright?.license === 'both' ? 'Personal & Commercial' : wallpaper.copyright?.license}
              </p>
              {wallpaper.copyright?.attributionRequired && (
                <p className="text-gray-300 text-sm mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                  <strong>Attribution Required:</strong> Please credit the creator when using this wallpaper.
                </p>
              )}
            </div>

            {/* Specs */}
            <div className="glass p-6 rounded-xl mt-6">
              <h3 className="text-xl font-bold mb-3 text-white">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Resolution</p>
                  <p className="text-white font-medium">
                    {wallpaper.images?.original?.width} × {wallpaper.images?.original?.height}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Format</p>
                  <p className="text-white font-medium uppercase">
                    {wallpaper.images?.original?.format}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">File Size</p>
                  <p className="text-white font-medium">
                    {(wallpaper.images?.original?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Aspect Ratio</p>
                  <p className="text-white font-medium">16:9</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for full image */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 modal-backdrop p-4"
          onClick={() => setShowModal(false)}
        >
          <img
            src={wallpaper.images?.preview?.url}
            alt={wallpaper.title}
            className="max-w-full max-h-full rounded-lg"
          />
        </div>
      )}
    </div>
  )
}

export default WallpaperDetail
