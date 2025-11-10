# 🚀 Quick Setup Guide - Run the Site Locally

## Option 1: Quick Start with MongoDB Atlas (Recommended - 5 minutes)

### Step 1: Get MongoDB Atlas (Free Cloud Database)

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
2. **Sign up** with Google (fastest)
3. **Create FREE cluster:**
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Click "Create"
4. **Create User:**
   - Username: `admin`
   - Password: `admin123` (or your choice)
   - Click "Create User"
5. **Network Access:**
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
6. **Get Connection String:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/`
   - Replace `<password>` with your actual password
   - Add database name at the end: `...mongodb.net/ai-wallpaper`

7. **Update `.env` file:**
   - Open `ai-wallpaper-platform/backend/.env`
   - Replace the MONGODB_URI line with your connection string

### Step 2: Install Dependencies & Run

Open terminal and run these commands:

```bash
# Go to backend
cd ai-wallpaper-platform/backend

# Install dependencies
npm install

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Keep this terminal open! The backend is now running on http://localhost:5000

### Step 3: Start Frontend (New Terminal)

```bash
# Go to frontend (from project root)
cd ai-wallpaper-platform/frontend

# Install dependencies
npm install

# Start frontend server
npm run dev
```

### Step 4: Open Your Browser

Visit: **http://localhost:3000**

🎉 The site should be running!

### Test Accounts

After seeding, you can login with:
- **Admin:** admin@aiwallpaper.com / admin123
- **Pro User:** john@example.com / password123
- **Basic User:** jane@example.com / password123

---

## Option 2: One-Command Setup (If you have MongoDB installed locally)

```bash
# Start MongoDB (if installed)
mongod --dbpath ~/data/db

# In new terminal - Backend
cd ai-wallpaper-platform/backend
npm install
npm run seed
npm run dev

# In new terminal - Frontend
cd ai-wallpaper-platform/frontend
npm install
npm run dev
```

---

## 🐛 Troubleshooting

### "Module not found"
```bash
# Make sure you're in the right directory and run:
npm install
```

### "Connection refused" or "ECONNREFUSED"
- MongoDB isn't running
- Check your MONGODB_URI in `.env`
- Use MongoDB Atlas instead (see Option 1)

### Port already in use
```bash
# Kill the process
# Mac/Linux:
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

### Frontend can't connect to backend
- Make sure backend is running (http://localhost:5000)
- Check `frontend/.env` has: `VITE_API_URL=http://localhost:5000/api`

---

## 📱 View on Your Phone (Same WiFi)

1. Find your computer's IP address:
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows
   ipconfig
   ```

2. Update `frontend/vite.config.js`:
   ```javascript
   server: {
     host: '0.0.0.0',  // Add this line
     port: 3000,
     // ... rest of config
   }
   ```

3. On your phone (same WiFi), visit:
   ```
   http://YOUR-IP-ADDRESS:3000
   ```

---

Need help? Let me know what error you're seeing!
