# 🎨 AI Wallpaper Platform

A complete, production-ready platform for selling, managing, and downloading AI-generated wallpapers. Built with modern technologies and inspired by Apple and Stripe's elegant design patterns.

## ✨ Features

### Frontend Features
- 🎯 **Modern UI/UX**: Sleek, minimalist design with smooth gradients, glass morphism, and elegant typography
- 🏠 **Hero Landing Page**: Compelling value proposition with engaging CTAs and statistics
- 🖼️ **Dynamic Gallery**: Categorized browsing with infinite scroll and lazy loading
- 🔍 **Advanced Search**: Filter by categories, tags, and featured status
- 📱 **Responsive Design**: Mobile-first approach, works perfectly on all devices
- 🎭 **Wallpaper Detail Pages**: High-res previews, AI model info, copyright details
- 👤 **User Accounts**: Profile management, favorites, download history
- 💳 **Subscription System**: Integrated Stripe payment with multiple tiers
- 🔐 **Authentication**: Email/password and OAuth (Google) support
- 📊 **Admin Dashboard**: Comprehensive management interface
- ⚡ **Performance**: Optimized image loading, lazy loading, infinite scroll

### Backend Features
- 🔒 **Secure Authentication**: JWT-based auth with bcrypt password hashing
- 💰 **Payment Processing**: Stripe integration for subscriptions
- 🖼️ **Image Processing**: Automated watermarking, thumbnails, format conversion
- 📦 **RESTful API**: Well-structured endpoints with proper error handling
- 🚦 **Rate Limiting**: Protection against abuse and DDoS
- 📧 **Email Service**: Welcome emails, subscription confirmations, password resets
- 📊 **Analytics**: Track downloads, views, popular wallpapers
- 🔐 **Permission System**: Role-based access control (User/Admin)
- 🎫 **Licensing**: Track commercial vs personal use
- 📈 **Scalable Architecture**: Modular, maintainable codebase

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Stripe** - Payment processing
- **Sharp** - Image processing
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
ai-wallpaper-platform/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts (seed, etc.)
│   ├── utils/           # Helper functions
│   ├── .env.example     # Environment variables template
│   ├── package.json     # Backend dependencies
│   └── server.js        # Main server file
│
└── frontend/
    ├── public/          # Static assets
    ├── src/
    │   ├── components/  # Reusable components
    │   │   ├── layout/  # Layout components
    │   │   └── auth/    # Auth components
    │   ├── pages/       # Page components
    │   │   ├── auth/    # Auth pages
    │   │   └── admin/   # Admin pages
    │   ├── store/       # State management
    │   ├── utils/       # Utilities (API, helpers)
    │   ├── App.jsx      # Main App component
    │   ├── main.jsx     # Entry point
    │   └── index.css    # Global styles
    ├── index.html       # HTML template
    ├── package.json     # Frontend dependencies
    ├── tailwind.config.js
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Stripe account (for payments)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-wallpaper-platform
```

2. **Backend Setup**
```bash
cd backend
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

4. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

5. **Seed Database** (Optional but recommended)
```bash
cd backend
npm run seed
```

This will create:
- Admin user: admin@aiwallpaper.com / admin123
- Pro user: john@example.com / password123
- Basic user: jane@example.com / password123
- Sample categories and wallpapers

6. **Start Development Servers**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-wallpaper-platform
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "newsletterSubscribed": true
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Wallpaper Endpoints

#### Get All Wallpapers
```http
GET /api/wallpapers?page=1&limit=24&category=abstract&featured=true
```

#### Get Single Wallpaper
```http
GET /api/wallpapers/:slug
```

#### Download Wallpaper
```http
POST /api/wallpapers/:id/download
Authorization: Bearer {token}
Content-Type: application/json

{
  "licenseType": "personal"
}
```

#### Toggle Favorite
```http
POST /api/wallpapers/:id/favorite
Authorization: Bearer {token}
```

### Subscription Endpoints

#### Get Plans
```http
GET /api/subscriptions/plans
```

#### Create Checkout Session
```http
POST /api/subscriptions/create-checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": "pro"
}
```

#### Get Subscription Status
```http
GET /api/subscriptions/status
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/stats
Authorization: Bearer {admin-token}
```

#### Get Pending Wallpapers
```http
GET /api/admin/wallpapers/pending
Authorization: Bearer {admin-token}
```

#### Approve Wallpaper
```http
PUT /api/admin/wallpapers/:id/approve
Authorization: Bearer {admin-token}
```

## 💎 Subscription Plans

### Free Plan
- Browse wallpapers
- View previews (with watermark)
- Limited features

### Basic Plan ($9.99/month)
- Unlimited downloads
- High-resolution images
- Personal use license
- Email support

### Pro Plan ($19.99/month)
- Everything in Basic
- Commercial use license
- Priority support
- Early access to new wallpapers
- Custom formats

### Enterprise Plan ($49.99/month)
- Everything in Pro
- API access
- Dedicated account manager
- Custom AI generation requests
- White-label options

## 🎨 Design System

### Colors
- Primary: Indigo (#6366f1)
- Secondary: Pink (#ec4899)
- Accent: Purple (#a855f7)
- Background: Black (#0a0a0a)
- Surface: Gray-900 (#1a1a1a)

### Typography
- Font Family: Inter
- Headings: Bold, gradient text
- Body: Regular, gray-300

### Components
- Glass morphism effects
- Rounded corners (8px, 12px, 16px)
- Smooth transitions and animations
- Hover effects with scale and shadow

## 🔐 Security Features

- JWT authentication with secure tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- XSS protection
- CSRF protection

## 🚀 Deployment

### Backend (Node.js)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy to Heroku, Railway, or DigitalOcean
4. Set up Stripe webhooks

### Frontend (React)
1. Build the production bundle
```bash
cd frontend
npm run build
```
2. Deploy to Vercel, Netlify, or Cloudflare Pages

### Database
- Use MongoDB Atlas for production
- Set up proper indexes
- Enable backups

## 📈 Future Enhancements

- [ ] AI wallpaper generation integration
- [ ] Social sharing features
- [ ] User reviews and ratings
- [ ] Advanced search with filters
- [ ] Batch download feature
- [ ] Mobile apps (iOS/Android)
- [ ] API for developers
- [ ] Multi-language support
- [ ] Dark/Light mode toggle
- [ ] Advanced analytics dashboard

## 🐛 Known Issues

None currently. Please report issues on GitHub.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Created with ❤️ for the AI Wallpaper Platform

## 📞 Support

For support, email support@aiwallpaper.com or join our Discord community.

---

**Note**: This is a demonstration project. Replace API keys, secrets, and configure production settings before deploying to production.
