# SlotSwapper - Peer-to-Peer Time-Slot Scheduling Application

[![GitHub Repository](https://img.shields.io/badge/GitHub-SlotSwapper-blue?logo=github)](https://github.com/Sarwan-Projects/SlotSwapper)
[![Live Demo](https://img.shields.io/badge/Demo-Coming%20Soon-green)](https://github.com/Sarwan-Projects/SlotSwapper)

SlotSwapper is a full-stack web application that allows users to swap time slots with each other. Users can mark their busy calendar slots as "swappable" and request to exchange them with other users' swappable slots.

**GitHub Repository**: https://github.com/Sarwan-Projects/SlotSwapper

## 🚀 Features

### Core Features
- **User Authentication**: Secure JWT-based signup and login with password hashing
- **Calendar Management**: Create, update, and delete personal events with timestamps
- **Slot Swapping**: Mark events as swappable and browse available slots from other users
- **Swap Requests**: Send and receive swap requests with accept/reject functionality
- **Real-time Updates**: Dynamic state management ensures UI reflects changes immediately
- **Protected Routes**: Authentication required for all calendar and swap features

### Technical Highlights
- **Double-Click Prevention**: Loading states prevent duplicate submissions
- **Cascade Delete**: User deletion automatically removes all associated data
- **Status Management**: SWAP_PENDING status prevents conflicts during active swaps
- **Responsive Design**: Beautiful gradient UI that works on all devices
- **Error Handling**: Comprehensive validation and user-friendly error messages

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **MongoDB Atlas** - Cloud database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Secure password hashing
- **express-validator** - Input validation and sanitization

### Frontend
- **React** - Component-based UI library
- **React Router** - Client-side routing with protected routes
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with gradients and animations

## � Prere quisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- Internet connection (for MongoDB Atlas)

**Note**: No local MongoDB installation required! The app uses MongoDB Atlas cloud database.

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Sarwan-Projects/SlotSwapper.git
cd SlotSwapper
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration

The `.env` file is already configured with MongoDB Atlas connection:

```env
PORT=5000
MONGODB_URI=mongodb+srv://youresbuddies:fmcS8QLnxt85ZBDh@cluster1.lwkedfx.mongodb.net/slotswapper?retryWrites=true&w=majority
JWT_SECRET=slotswapper_secret_key_change_in_production_2024
NODE_ENV=development
```

**For production**: Change `JWT_SECRET` to a secure random string!

### 5. Run the Application

#### Development Mode (Recommended):

```bash
npm run dev
```

This starts both servers:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

#### Production Mode:

```bash
# Build frontend
npm run build

# Start server
npm start
```

Application available at: http://localhost:5000

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Events (Calendar)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/events` | Get all user's events | Yes |
| POST | `/api/events` | Create new event | Yes |
| PUT | `/api/events/:id` | Update event | Yes |
| DELETE | `/api/events/:id` | Delete event | Yes |

### Swap Operations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/swappable-slots` | Get all swappable slots (excluding user's own) | Yes |
| POST | `/api/swap-request` | Create a swap request | Yes |
| GET | `/api/swap-requests/incoming` | Get incoming swap requests | Yes |
| GET | `/api/swap-requests/outgoing` | Get outgoing swap requests | Yes |
| POST | `/api/swap-response/:requestId` | Accept or reject swap request | Yes |

### Authentication Header

All protected endpoints require JWT token:

```
Authorization: Bearer <your_jwt_token>
```

## 🎯 How It Works

### The Swap Flow

1. **User A** creates an event "Team Meeting" and marks it as SWAPPABLE
2. **User B** creates an event "Focus Block" and marks it as SWAPPABLE
3. **User B** goes to Marketplace and sees User A's "Team Meeting"
4. **User B** clicks "Request Swap" and selects their "Focus Block" to offer
5. Both events are marked as SWAP_PENDING (locked during negotiation)
6. **User A** receives the request in their Requests page
7. **User A** clicks "Accept" - the events swap owners automatically!
8. Both events return to BUSY status
9. User A now has "Focus Block" and User B has "Team Meeting"

### Status Flow

```
BUSY → (User marks as swappable) → SWAPPABLE → (Swap requested) → SWAP_PENDING
                                                                         ↓
                                                                    (Accepted)
                                                                         ↓
                                                                       BUSY
                                                                    (New owner)
```

## 🧪 Testing the Application

### Automated API Testing

Run the included test script:

```bash
node test-api.js
```

Expected output:
```
🧪 Testing SlotSwapper API...
1️⃣ Testing Signup... ✅
2️⃣ Testing Create Event... ✅
3️⃣ Testing Get Events... ✅
4️⃣ Testing Update Event Status... ✅
5️⃣ Testing Get Swappable Slots... ✅
6️⃣ Testing Delete Event... ✅
🎉 All tests passed!
```

### Manual Testing (Full Swap Flow)

1. **Browser 1** (Regular mode):
   - Go to http://localhost:3000
   - Sign up as Alice (alice@example.com)
   - Create event: "Team Meeting" (tomorrow 10-11 AM)
   - Click "Make Swappable"

2. **Browser 2** (Incognito mode):
   - Go to http://localhost:3000
   - Sign up as Bob (bob@example.com)
   - Create event: "Focus Block" (tomorrow 2-3 PM)
   - Click "Make Swappable"
   - Go to "Marketplace" - see Alice's event
   - Click "Request Swap" - select your "Focus Block"

3. **Back to Browser 1** (Alice):
   - Go to "Requests"
   - See Bob's incoming request
   - Click "Accept"
   - Go to "My Calendar" - you now have "Focus Block"!

4. **Back to Browser 2** (Bob):
   - Go to "My Calendar" - you now have "Team Meeting"!

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  timestamps: true
}
```

### Event Model
```javascript
{
  title: String,
  startTime: Date,
  endTime: Date,
  status: Enum ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
  userId: ObjectId (ref: User),
  timestamps: true
}
```

### SwapRequest Model
```javascript
{
  requesterId: ObjectId (ref: User),
  requesterSlotId: ObjectId (ref: Event),
  targetUserId: ObjectId (ref: User),
  targetSlotId: ObjectId (ref: Event),
  status: Enum ['PENDING', 'ACCEPTED', 'REJECTED'],
  timestamps: true
}
```

## 🚢 Deployment to Render

### Step 1: Prepare Repository

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: slotswapper
   - **Environment**: Node
   - **Build Command**: `npm install && cd client && npm install && npm run build`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables

Add these in Render dashboard:

```
NODE_ENV=production
JWT_SECRET=your_secure_random_secret_key_here
MONGODB_URI=mongodb+srv://youresbuddies:fmcS8QLnxt85ZBDh@cluster1.lwkedfx.mongodb.net/slotswapper?retryWrites=true&w=majority
```

### Step 4: Deploy

Click "Create Web Service" and wait for deployment (5-10 minutes).

Your app will be live at: `https://slotswapper.onrender.com`

## 🎨 UI Features

- **Modern Gradient Design**: Purple gradient theme (667eea → 764ba2)
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects and transitions
- **Status Badges**: Color-coded (Blue=BUSY, Green=SWAPPABLE, Orange=PENDING)
- **Loading States**: Prevents double-clicks with "Processing..." feedback
- **Empty States**: Friendly messages when no data available
- **Real-time Updates**: UI refreshes automatically after actions

## 🔐 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Signed tokens with expiration
3. **Protected Routes**: Middleware authentication on all sensitive endpoints
4. **Input Validation**: express-validator on all inputs
5. **CORS Configuration**: Controlled cross-origin requests
6. **Environment Variables**: Sensitive data in .env (not committed)
7. **Cascade Delete**: User deletion removes all associated data

## 🎯 Design Decisions

### Why JWT?
- Stateless authentication enables horizontal scaling
- No server-side session storage needed
- Works seamlessly with React frontend
- Easy to implement and secure

### Why MongoDB Atlas?
- Cloud-based, no local installation required
- Easy to scale and manage
- Free tier perfect for development
- Mongoose provides elegant ODM

### Why SWAP_PENDING Status?
- Prevents race conditions
- Locks slots during negotiation
- Ensures data consistency
- Prevents double-booking

### Why React?
- Component-based architecture
- Virtual DOM for performance
- Large ecosystem and community
- Easy state management

## 🐛 Known Limitations

1. No real-time notifications (WebSocket not implemented)
2. No email notifications for swap requests
3. Basic calendar view (no visual grid)
4. No recurring events support
5. Time zones handled by browser (local time)
6. No event overlap validation

## � AFuture Enhancements

1. WebSocket integration for real-time notifications
2. Email notifications via SendGrid/Nodemailer
3. Visual calendar grid with drag-and-drop
4. Recurring events support
5. Event categories and filtering
6. User profiles with avatars
7. Search functionality
8. Multi-party swaps
9. Swap history and analytics
10. Mobile app (React Native)

## 📝 Project Structure

```
SlotSwapper/
├── server/                      # Backend
│   ├── models/                  # Mongoose models
│   │   ├── User.js             # User schema with cascade delete
│   │   ├── Event.js            # Event/Slot schema
│   │   └── SwapRequest.js      # Swap request schema
│   ├── routes/                  # API routes
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── events.js           # Event CRUD endpoints
│   │   └── swaps.js            # Swap logic endpoints
│   ├── middleware/              # Express middleware
│   │   └── auth.js             # JWT authentication
│   └── index.js                # Server entry point
├── client/                      # Frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Signup.js       # Signup page
│   │   │   ├── Navbar.js       # Navigation bar
│   │   │   ├── Dashboard.js    # User's calendar
│   │   │   ├── EventForm.js    # Create event modal
│   │   │   ├── Marketplace.js  # Browse swappable slots
│   │   │   └── Requests.js     # Manage swap requests
│   │   ├── App.js              # Main app with routing
│   │   ├── App.css             # Global styles
│   │   └── index.js            # React entry point
│   └── package.json            # Frontend dependencies
├── .env                         # Environment variables
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── package.json                # Backend dependencies
├── render.yaml                 # Render deployment config
├── test-api.js                 # API testing script
└── README.md                   # This file
```

## 🤝 Contributing

This project was created as a technical challenge for the ServiceHive Full Stack Intern position.

## 📄 License

MIT License - Free to use for learning and portfolio purposes.

## 👤 Author

Created for ServiceHive Full Stack Intern Technical Challenge

## 🙏 Acknowledgments

- ServiceHive for the interesting technical challenge
- MongoDB Atlas for free cloud database hosting
- React and Express communities for excellent documentation

---

## 📞 Support

If you encounter any issues:

1. Check that all dependencies are installed
2. Verify MongoDB Atlas connection is active
3. Check browser console for errors (F12)
4. Review server logs in terminal
5. Ensure environment variables are set correctly

---

**Built with ❤️ using the MERN Stack**

🚀 **Ready for deployment and demonstration!**
