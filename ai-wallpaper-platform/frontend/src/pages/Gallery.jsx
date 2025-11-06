import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiDownload, FiStar, FiHeart } from 'react-icons/fi'
import InfiniteScroll from 'react-infinite-scroll-component'
import { wallpaperAPI, categoryAPI } from '../utils/api'
import toast from 'react-hot-toast'

const Gallery = () => {
  const { category } = useParams()
  const [wallpapers, setWallpapers] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    setWallpapers([])
    setPage(1)
    setHasMore(true)
    fetchWallpapers(1, selectedCategory)
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll()
      setCategories(response.data.data.categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchWallpapers = async (pageNum, cat) => {
    try {
      setLoading(true)
      const params = {
        page: pageNum,
        limit: 24
      }
      if (cat && cat !== 'all') {
        params.category = cat
      }

      const response = await wallpaperAPI.getAll(params)
      const newWallpapers = response.data.data.wallpapers
      const pagination = response.data.data.pagination

      if (pageNum === 1) {
        setWallpapers(newWallpapers)
      } else {
        setWallpapers(prev => [...prev, ...newWallpapers])
      }

      setHasMore(pageNum < pagination.pages)
    } catch (error) {
      console.error('Error fetching wallpapers:', error)
      toast.error('Failed to load wallpapers')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchWallpapers(nextPage, selectedCategory)
  }

  return (
    <div className="pt-24 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Wallpaper Gallery
          </h1>
          <p className="text-gray-400 text-lg">
            Discover thousands of stunning AI-generated wallpapers
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-3 pb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-primary-600 to-pink-600 text-white'
                  : 'glass text-gray-300 hover:bg-white/10'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-6 py-2 rounded-full font-medium transition whitespace-nowrap flex items-center space-x-2 ${
                  selectedCategory === cat.slug
                    ? 'bg-gradient-to-r from-primary-600 to-pink-600 text-white'
                    : 'glass text-gray-300 hover:bg-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wallpapers Grid */}
        {loading && page === 1 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[3/4] skeleton rounded-xl" />
            ))}
          </div>
        ) : (
          <InfiniteScroll
            dataLength={wallpapers.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
              </div>
            }
            endMessage={
              <p className="text-center text-gray-400 py-8">
                You've reached the end!
              </p>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wallpapers.map((wallpaper) => (
                <Link
                  key={wallpaper._id}
                  to={`/wallpaper/${wallpaper.slug}`}
                  className="group relative overflow-hidden rounded-xl aspect-[3/4] image-hover"
                >
                  <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundImage: `url(${wallpaper.images?.thumbnail?.url || '/placeholder.jpg'})`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                    <h3 className="text-white font-semibold text-sm md:text-base mb-2 line-clamp-1">
                      {wallpaper.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs md:text-sm text-gray-300">
                      <span className="flex items-center space-x-1">
                        <FiDownload size={14} />
                        <span>{wallpaper.stats?.downloads || 0}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <FiHeart size={14} />
                        <span>{wallpaper.stats?.favorites || 0}</span>
                      </span>
                    </div>
                  </div>

                  {/* Featured badge */}
                  {wallpaper.featured && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <FiStar size={12} />
                      <span>Featured</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </InfiniteScroll>
        )}

        {/* Empty state */}
        {!loading && wallpapers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-white mb-2">No wallpapers found</h3>
            <p className="text-gray-400">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Gallery
