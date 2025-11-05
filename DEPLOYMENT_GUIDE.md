# 🚀 Deployment Guide - SlotSwapper

Complete step-by-step guide to deploy SlotSwapper to Render (backend) and Vercel (frontend).

---

## 📋 Prerequisites

- GitHub account with SlotSwapper repository
- Render account (free): https://render.com
- Vercel account (free): https://vercel.com
- MongoDB Atlas account (already configured)

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare for Deployment

Your backend is already configured with `render.yaml`. No changes needed!

### Step 2: Create Render Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** (if not already connected)
4. Select your **SlotSwapper** repository
5. Render will detect the `render.yaml` file

### Step 3: Configure Service

Render will auto-fill from `render.yaml`, but verify:

- **Name**: `slotswapper-api` (or your choice)
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
NODE_ENV = production
PORT = 5000
JWT_SECRET = your_secure_random_secret_key_here
MONGODB_URI = mongodb+srv://youresbuddies:fmcS8QLnxt85ZBDh@cluster1.lwkedfx.mongodb.net/slotswapper?retryWrites=true&w=majority
```

**Important**: Change `JWT_SECRET` to a secure random string!

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll see: ✅ **Live**
4. **Copy your backend URL**: `https://slotswapper-api.onrender.com`

### Step 6: Test Backend

Test your API:
```bash
curl https://your-backend-url.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

You should get a response with a token!

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Update API URLs

1. Open `client/.env.production`
2. Replace with your Render backend URL:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
```

3. Commit and push:
```bash
git add client/.env.production
git commit -m "Update production API URLs"
git push
```

### Step 2: Update Socket.io Client

The SocketContext is already configured to use `REACT_APP_SOCKET_URL` environment variable. No changes needed!

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to client folder:
```bash
cd client
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel --prod
```

5. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name? **slotswapper** (or your choice)
   - Directory? **./** (current directory)
   - Override settings? **N**

6. Wait for deployment (2-3 minutes)
7. **Copy your frontend URL**: `https://slotswapper.vercel.app`

#### Option B: Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   
5. Add Environment Variables:
   ```
   REACT_APP_API_URL = https://your-backend-url.onrender.com
   REACT_APP_SOCKET_URL = https://your-backend-url.onrender.com
   ```

6. Click **"Deploy"**
7. Wait for deployment
8. **Copy your frontend URL**

### Step 4: Update Backend CORS

Update `server/index.js` to allow your Vercel domain:

```javascript
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? 'https://slotswapper.vercel.app'  // Your Vercel URL
      : 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
```

Commit and push:
```bash
git add server/index.js
git commit -m "Update CORS for production"
git push
```

Render will automatically redeploy!

---

## Part 3: Verify Deployment

### Test the Full Application

1. **Open your Vercel URL**: `https://slotswapper.vercel.app`
2. **Sign up** for a new account
3. **Create an event** and mark it as swappable
4. **Open incognito mode** and sign up as another user
5. **Create and swap** - test the full flow!
6. **Check notifications** - WebSocket should work!

### Check WebSocket Connection

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by **WS** (WebSocket)
4. You should see a WebSocket connection to your Render backend
5. Status should be **101 Switching Protocols** (success!)

---

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL copied
- [ ] Frontend environment variables updated
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL copied
- [ ] CORS updated in backend
- [ ] Backend redeployed
- [ ] Signup works
- [ ] Login works
- [ ] Create event works
- [ ] Swap request works
- [ ] Real-time notifications work
- [ ] WebSocket connected

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Render deployment fails

**Solution**:
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure MongoDB URI is correct
- Check Node.js version compatibility

**Problem**: API returns 500 errors

**Solution**:
- Check Render logs for errors
- Verify MongoDB Atlas connection
- Check if IP whitelist includes 0.0.0.0/0
- Verify JWT_SECRET is set

### Frontend Issues

**Problem**: Vercel deployment fails

**Solution**:
- Check build logs in Vercel dashboard
- Verify `client/` directory structure
- Ensure all dependencies are in package.json
- Check for build errors locally first

**Problem**: API calls fail (CORS errors)

**Solution**:
- Verify REACT_APP_API_URL is correct
- Check CORS configuration in backend
- Ensure backend allows your Vercel domain
- Check browser console for exact error

**Problem**: WebSocket not connecting

**Solution**:
- Verify REACT_APP_SOCKET_URL is correct
- Check WebSocket CORS in backend
- Ensure Render allows WebSocket connections
- Check browser DevTools Network tab

### Database Issues

**Problem**: Can't connect to MongoDB

**Solution**:
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access (0.0.0.0/0)
- Ensure database user has correct permissions
- Check if cluster is active

---

## 📊 Monitoring

### Render Monitoring

- View logs: Render Dashboard → Your Service → Logs
- Check metrics: Dashboard → Metrics
- Set up alerts: Dashboard → Settings → Notifications

### Vercel Monitoring

- View deployments: Vercel Dashboard → Your Project
- Check analytics: Dashboard → Analytics
- View logs: Dashboard → Deployments → View Logs

---

## 🔄 Redeployment

### Backend (Render)

Automatic redeployment on git push:
```bash
git add .
git commit -m "Update backend"
git push
```

Render will automatically detect and redeploy!

Manual redeploy:
- Go to Render Dashboard
- Click "Manual Deploy" → "Deploy latest commit"

### Frontend (Vercel)

Automatic redeployment on git push:
```bash
git add .
git commit -m "Update frontend"
git push
```

Vercel will automatically detect and redeploy!

Manual redeploy:
- Go to Vercel Dashboard
- Click "Redeploy"

---

## 💰 Cost

### Free Tier Limits

**Render Free Tier**:
- 750 hours/month
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Perfect for demos and portfolios

**Vercel Free Tier**:
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Perfect for frontend hosting

**MongoDB Atlas Free Tier**:
- 512 MB storage
- Shared RAM
- No backups
- Perfect for development

**Total Cost**: $0/month 🎉

---

## 🚀 Going to Production

For a real production deployment:

1. **Upgrade Render** to paid plan ($7/month)
   - No spin-down
   - Better performance
   - Custom domains

2. **Upgrade MongoDB Atlas** to M10 ($57/month)
   - More storage
   - Automated backups
   - Better performance

3. **Add monitoring**:
   - Sentry for error tracking
   - LogRocket for session replay
   - Google Analytics for usage

4. **Add security**:
   - Rate limiting
   - HTTPS enforcement
   - Security headers
   - Input sanitization

---

## ✅ Success!

Your SlotSwapper is now live and accessible worldwide!

**Backend**: https://your-backend-url.onrender.com
**Frontend**: https://slotswapper.vercel.app

Share your live demo link in your interview submission! 🎉

---

## 📝 Update README

Don't forget to update the README badges:

```markdown
[![Live Demo](https://img.shields.io/badge/Demo-Live-green)](https://slotswapper.vercel.app)
```

And add your live URLs:

```markdown
**Live Demo**: https://slotswapper.vercel.app
**API**: https://your-backend-url.onrender.com
```

---

**Congratulations! Your SlotSwapper is deployed!** 🚀
