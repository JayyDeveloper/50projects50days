import { useEffect, useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'
import { subscriptionAPI } from '../utils/api'
import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Pricing = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [plans, setPlans] = useState({})
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(null)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await subscriptionAPI.getPlans()
      setPlans(response.data.data.plans)
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planKey) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to subscribe')
      navigate('/login')
      return
    }

    try {
      setCheckoutLoading(planKey)
      const response = await subscriptionAPI.createCheckout(planKey)
      window.location.href = response.data.data.url
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create checkout')
      setCheckoutLoading(null)
    }
  }

  const plansList = Object.entries(plans).map(([key, value]) => ({
    key,
    ...value
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plansList.map((plan, index) => (
            <div
              key={plan.key}
              className={`glass rounded-2xl p-8 relative ${
                index === 1 ? 'border-2 border-primary-500 transform md:scale-105' : ''
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold gradient-text">${plan.price}</span>
                <span className="text-gray-400">/{plan.interval}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3 text-gray-300">
                    <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.key)}
                disabled={checkoutLoading === plan.key}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  index === 1
                    ? 'bg-gradient-to-r from-primary-600 to-pink-600 text-white hover:shadow-lg hover:shadow-primary-500/50'
                    : 'glass hover:bg-white/10 text-white'
                } disabled:opacity-50`}
              >
                {checkoutLoading === plan.key ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-300">
                Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>

            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">
                What's included in the free trial?
              </h3>
              <p className="text-gray-300">
                All new users get a 14-day free trial with full access to our Pro plan features.
              </p>
            </div>

            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-bold text-white mb-2">
                Can I use wallpapers commercially?
              </h3>
              <p className="text-gray-300">
                Pro and Enterprise plans include commercial use licenses for all wallpapers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
