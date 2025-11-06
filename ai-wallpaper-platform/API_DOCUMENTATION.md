# API Documentation

Complete API reference for the AI Wallpaper Platform backend.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Auth Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "newsletterSubscribed": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "subscription": {
        "plan": "free",
        "status": "trial"
      }
    },
    "token": "jwt-token..."
  }
}
```

### Login
Authenticate a user.

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`

### Get Current User
Get authenticated user's profile.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

### Forgot Password
Request password reset email.

**Endpoint:** `POST /auth/forgot-password`

**Body:**
```json
{
  "email": "john@example.com"
}
```

### Reset Password
Reset password with token.

**Endpoint:** `PUT /auth/reset-password/:token`

**Body:**
```json
{
  "password": "newpassword123"
}
```

---

## Wallpaper Endpoints

### Get All Wallpapers
Retrieve paginated list of wallpapers.

**Endpoint:** `GET /wallpapers`

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 24)
- `category` (string): Filter by category slug
- `tags` (string): Comma-separated tags
- `featured` (boolean): Filter featured wallpapers
- `sort` (string): Sort field (default: -createdAt)
- `search` (string): Search query

**Example:**
```
GET /wallpapers?page=1&limit=24&category=abstract&featured=true
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "wallpapers": [...],
    "pagination": {
      "page": 1,
      "limit": 24,
      "total": 100,
      "pages": 5
    }
  }
}
```

### Get Single Wallpaper
Get wallpaper details by slug.

**Endpoint:** `GET /wallpapers/:slug`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "wallpaper": {
      "title": "Neon Dreams",
      "slug": "neon-dreams",
      "description": "...",
      "images": {
        "thumbnail": {...},
        "preview": {...},
        "original": {...}
      },
      "categories": [...],
      "stats": {...},
      "copyright": {...}
    },
    "canDownloadOriginal": true,
    "isFavorited": false
  }
}
```

### Download Wallpaper
Download high-resolution wallpaper.

**Endpoint:** `POST /wallpapers/:id/download`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "licenseType": "personal"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Download initiated",
  "data": {
    "downloadUrl": "...",
    "filename": "neon-dreams.jpg",
    "license": "personal",
    "copyright": {...}
  }
}
```

### Toggle Favorite
Add or remove wallpaper from favorites.

**Endpoint:** `POST /wallpapers/:id/favorite`

**Headers:** `Authorization: Bearer {token}`

**Response:** `200 OK`

### Create Wallpaper (Admin)
Upload new wallpaper.

**Endpoint:** `POST /wallpapers`

**Headers:** `Authorization: Bearer {admin-token}`

### Update Wallpaper (Admin)
**Endpoint:** `PUT /wallpapers/:id`

### Delete Wallpaper (Admin)
**Endpoint:** `DELETE /wallpapers/:id`

### Get Featured Wallpapers
**Endpoint:** `GET /wallpapers/featured`

---

## Category Endpoints

### Get All Categories
**Endpoint:** `GET /categories`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "_id": "...",
        "name": "Abstract",
        "slug": "abstract",
        "description": "...",
        "color": "#6366f1",
        "icon": "🎨",
        "wallpaperCount": 42
      }
    ]
  }
}
```

### Get Single Category
**Endpoint:** `GET /categories/:slug`

---

## Subscription Endpoints

### Get Plans
Get available subscription plans.

**Endpoint:** `GET /subscriptions/plans`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "plans": {
      "basic": {
        "name": "Basic",
        "price": 9.99,
        "interval": "month",
        "features": [...]
      },
      "pro": {...},
      "enterprise": {...}
    }
  }
}
```

### Create Checkout Session
Initiate Stripe checkout.

**Endpoint:** `POST /subscriptions/create-checkout`

**Headers:** `Authorization: Bearer {token}`

**Body:**
```json
{
  "plan": "pro"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sessionId": "...",
    "url": "https://checkout.stripe.com/..."
  }
}
```

### Get Subscription Status
**Endpoint:** `GET /subscriptions/status`

**Headers:** `Authorization: Bearer {token}`

### Cancel Subscription
**Endpoint:** `POST /subscriptions/cancel`

**Headers:** `Authorization: Bearer {token}`

### Resume Subscription
**Endpoint:** `POST /subscriptions/resume`

**Headers:** `Authorization: Bearer {token}`

### Stripe Webhook
**Endpoint:** `POST /subscriptions/webhook`

---

## Admin Endpoints

All admin endpoints require admin role and authentication.

### Get Dashboard Stats
**Endpoint:** `GET /admin/stats`

**Headers:** `Authorization: Bearer {admin-token}`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 1250,
      "totalWallpapers": 500,
      "totalDownloads": 10000,
      "activeSubscriptions": 450,
      "pendingWallpapers": 12,
      "newUsersThisMonth": 50,
      "downloadsThisMonth": 1500
    },
    "topWallpapers": [...],
    "subscriptionBreakdown": [...]
  }
}
```

### Get Pending Wallpapers
**Endpoint:** `GET /admin/wallpapers/pending`

### Approve Wallpaper
**Endpoint:** `PUT /admin/wallpapers/:id/approve`

### Reject Wallpaper
**Endpoint:** `PUT /admin/wallpapers/:id/reject`

**Body:**
```json
{
  "reason": "Does not meet quality standards"
}
```

### Get Users
**Endpoint:** `GET /admin/users`

**Query Parameters:**
- `page`, `limit`: Pagination
- `role`: Filter by role
- `subscriptionPlan`: Filter by plan
- `search`: Search by name/email

### Update User Role
**Endpoint:** `PUT /admin/users/:id/role`

**Body:**
```json
{
  "role": "admin"
}
```

### Toggle User Status
**Endpoint:** `PUT /admin/users/:id/status`

### Get Analytics
**Endpoint:** `GET /admin/analytics`

### Create Category
**Endpoint:** `POST /admin/categories`

### Update Category
**Endpoint:** `PUT /admin/categories/:id`

### Delete Category
**Endpoint:** `DELETE /admin/categories/:id`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'user' is not authorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limits

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 failed attempts per 15 minutes
- **Downloads**: 50 downloads per hour (varies by plan)
- **Search**: 30 requests per minute

---

## Webhook Events (Stripe)

The platform handles these Stripe webhook events:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

Configure your webhook URL in Stripe Dashboard:
```
https://your-domain.com/api/subscriptions/webhook
```

---

## Data Models

### User
```typescript
{
  email: string
  password: string (hashed)
  name: string
  avatar: string
  role: 'user' | 'admin'
  subscription: {
    plan: 'free' | 'basic' | 'pro' | 'enterprise'
    status: 'active' | 'canceled' | 'expired' | 'trial'
    stripeCustomerId: string
    stripeSubscriptionId: string
    currentPeriodEnd: Date
  }
  favorites: ObjectId[]
  downloadHistory: Array<{
    wallpaper: ObjectId
    downloadedAt: Date
    license: 'personal' | 'commercial'
  }>
}
```

### Wallpaper
```typescript
{
  title: string
  slug: string
  description: string
  categories: ObjectId[]
  tags: string[]
  images: {
    thumbnail: ImageData
    preview: ImageData
    original: ImageData
  }
  aiModel: {
    name: string
    version: string
    parameters: object
  }
  copyright: {
    owner: string
    license: 'personal' | 'commercial' | 'both'
    attributionRequired: boolean
  }
  stats: {
    views: number
    downloads: number
    favorites: number
  }
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  featured: boolean
}
```

---

For more information, visit the [main documentation](README.md).
