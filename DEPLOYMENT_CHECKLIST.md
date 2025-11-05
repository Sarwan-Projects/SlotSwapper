# 🚀 Deployment Checklist

Use this checklist to deploy SlotSwapper step by step.

---

## ✅ Pre-Deployment

- [x] All code committed and pushed to GitHub
- [x] README.md updated and clean
- [x] No bugs or errors in code
- [x] All tests passing (`npm test`)
- [x] MongoDB Atlas configured
- [x] Environment variables documented

---

## 📦 Backend Deployment (Render)

### Step 1: Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up / Log in
- [ ] Connect GitHub account

### Step 2: Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select SlotSwapper repository
- [ ] Render detects `render.yaml`

### Step 3: Configure Service
- [ ] Name: `slotswapper-api`
- [ ] Environment: Node
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`

### Step 4: Add Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `5000`
- [ ] `JWT_SECRET` = (generate secure key)
- [ ] `MONGODB_URI` = (your MongoDB Atlas URI)

### Step 5: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (5-10 min)
- [ ] Copy backend URL: `https://__________.onrender.com`

### Step 6: Test Backend
- [ ] Test signup endpoint with curl/Postman
- [ ] Verify API responds correctly
- [ ] Check logs for errors

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Update Environment Variables
- [ ] Open `client/.env.production`
- [ ] Update `REACT_APP_API_URL` with Render URL
- [ ] Update `REACT_APP_SOCKET_URL` with Render URL
- [ ] Commit and push changes

### Step 2: Install Vercel CLI
- [ ] Run: `npm install -g vercel`
- [ ] Run: `vercel login`

### Step 3: Deploy Frontend
- [ ] Navigate to client folder: `cd client`
- [ ] Run: `vercel --prod`
- [ ] Follow prompts
- [ ] Copy frontend URL: `https://__________.vercel.app`

### Step 4: Update Backend CORS
- [ ] Update `server/index.js` CORS origin
- [ ] Add your Vercel URL
- [ ] Commit and push (Render auto-redeploys)

---

## 🧪 Post-Deployment Testing

### Test Authentication
- [ ] Open frontend URL
- [ ] Sign up for new account
- [ ] Verify signup works
- [ ] Log out and log in
- [ ] Verify login works

### Test Event Management
- [ ] Create a new event
- [ ] Update event status to SWAPPABLE
- [ ] Delete an event
- [ ] Verify all CRUD operations work

### Test Swap Flow
- [ ] Open incognito window
- [ ] Sign up as second user
- [ ] Create and mark event as SWAPPABLE
- [ ] Go to Marketplace
- [ ] Request a swap
- [ ] Check if notification appears 🔔
- [ ] Accept/reject swap
- [ ] Verify events swapped correctly

### Test WebSocket
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab → WS filter
- [ ] Verify WebSocket connection
- [ ] Test real-time notifications

---

## 📝 Update Documentation

### Update README
- [ ] Update Live Demo badge with Vercel URL
- [ ] Add live demo link
- [ ] Add API URL
- [ ] Commit and push

### Update GitHub Repository
- [ ] Add description
- [ ] Add topics/tags
- [ ] Update About section with live URL

---

## 🎯 Final Verification

- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Database connection works
- [ ] Authentication works
- [ ] Events CRUD works
- [ ] Swap requests work
- [ ] Real-time notifications work
- [ ] WebSocket connected
- [ ] No console errors
- [ ] Mobile responsive
- [ ] All features functional

---

## 📊 Monitoring Setup

### Render
- [ ] Check deployment logs
- [ ] Set up email notifications
- [ ] Monitor resource usage

### Vercel
- [ ] Check deployment status
- [ ] Review analytics
- [ ] Monitor bandwidth usage

---

## 🎉 Submission

### Prepare Submission
- [ ] GitHub URL ready
- [ ] Live demo URL ready
- [ ] Test credentials prepared (if needed)
- [ ] Screenshots taken (optional)

### Submit to ServiceHive
- [ ] Email with GitHub link
- [ ] Include live demo URL
- [ ] Mention all bonus features implemented
- [ ] Highlight real-time notifications
- [ ] Mention test suite

---

## ✅ Deployment Complete!

**GitHub**: https://github.com/Sarwan-Projects/SlotSwapper
**Live Demo**: https://__________.vercel.app
**API**: https://__________.onrender.com

**Status**: 🎉 Ready for Interview Submission!

---

## 🆘 Troubleshooting

If something doesn't work:

1. Check DEPLOYMENT_GUIDE.md troubleshooting section
2. Review Render logs for backend errors
3. Check Vercel logs for frontend errors
4. Verify environment variables are correct
5. Test API endpoints with Postman
6. Check browser console for errors
7. Verify MongoDB Atlas connection
8. Check WebSocket connection in DevTools

---

**Good luck with your interview!** 🚀
