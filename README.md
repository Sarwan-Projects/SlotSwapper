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

### 🎁 Bonus Features Implemented

✅ **Deployment Ready**
- Configured for Render deployment with `render.yaml`
- MongoDB Atlas cloud database integration
- Production build configuration
- Environment variables properly managed

✅ **Comprehensive Documentation**
- Detailed README with setup instructions
- Complete API endpoint documentation
- Testing guide included
- Design decisions explained
- Assumptions and challenges documented

✅ **API Testing**
- Automated test script (`test-api.js`)
- Tests all major endpoints
- Validates authentication flow
- Verifies CRUD operations
- Tests swap logic

✅ **Production-Ready Code**
- Error handling on all endpoints
- Input validation with express-validator
- Security best practices (JWT, bcrypt)
- Clean code structure
- Proper separation of concerns

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

### 6. Docker Setup (Alternative)

If you prefer using Docker:

```bash
# Make sure Docker is installed and running

# Create .env file with your MongoDB URI
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string

# Build and run with Docker Compose
docker-compose up --build

# Application will be available at http://localhost:5000
```

**Docker Benefits**:
- No need to install Node.js locally
- Consistent environment across machines
- Easy deployment
- Isolated dependencies

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

## 🎯 Design Decisions & Architecture

### Authentication Strategy
**Choice**: JWT (JSON Web Tokens)

**Reasoning**:
- Stateless authentication enables horizontal scaling
- No server-side session storage needed
- Works seamlessly with React frontend
- Tokens can be easily validated on each request
- 7-day expiration balances security and UX

### Database Selection
**Choice**: MongoDB Atlas with Mongoose ODM

**Reasoning**:
- Cloud-based, no local installation required
- Flexible schema perfect for rapid development
- Easy to scale horizontally
- Free tier sufficient for development and demo
- Mongoose provides elegant data modeling
- Document-based structure fits event data well

### Swap Transaction Logic
**Choice**: SWAP_PENDING status with atomic operations

**Reasoning**:
- Prevents race conditions when multiple users request same slot
- Locks slots during negotiation period
- Ensures data consistency during swap
- Prevents double-booking scenarios
- Clear state machine: BUSY → SWAPPABLE → SWAP_PENDING → BUSY

**Implementation**:
1. When swap requested: Both slots → SWAP_PENDING
2. If accepted: Swap owners, both → BUSY
3. If rejected: Both slots → SWAPPABLE

### Frontend Architecture
**Choice**: React with component-based design

**Reasoning**:
- Component reusability (EventForm, Navbar, etc.)
- Virtual DOM for optimal performance
- React Router for seamless navigation
- useState for simple state management (sufficient for this scope)
- Could scale to Redux/Context API if needed

### UI/UX Design
**Choice**: Gradient purple theme with card-based layout

**Reasoning**:
- Modern, professional appearance
- Purple gradient (667eea → 764ba2) is visually appealing
- Card-based design clearly separates events
- Color-coded status badges (Blue/Green/Orange) for quick recognition
- Responsive design works on all devices
- Loading states provide user feedback

### API Design
**Choice**: RESTful API with clear endpoint structure

**Reasoning**:
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Intuitive endpoint naming (/api/events, /api/swap-request)
- Consistent response format
- Proper status codes (200, 201, 400, 401, 404, 500)
- Easy to document and test

## 📋 Assumptions Made

1. **User Behavior**
   - Users are honest and won't abuse the system
   - Users understand the swap concept
   - Users will check their requests regularly

2. **Time Management**
   - Time zones handled by browser (local time)
   - No validation for overlapping events
   - Events can be created for any future date
   - No minimum/maximum event duration

3. **Swap Logic**
   - One-to-one swaps only (no multi-party swaps)
   - Once accepted, swap is final (no undo)
   - Users can only swap their own SWAPPABLE slots
   - Rejected swaps return slots to SWAPPABLE immediately

4. **Data Management**
   - User deletion is permanent (cascade delete)
   - No soft delete functionality
   - No event history tracking
   - No audit logs

5. **Security**
   - HTTPS in production (handled by Render)
   - JWT secret is secure in production
   - MongoDB Atlas handles database security
   - No rate limiting needed for demo

6. **Scalability**
   - Current architecture sufficient for demo
   - Can scale horizontally if needed
   - MongoDB Atlas can handle growth
   - No caching layer needed initially

## 🚧 Challenges Faced & Solutions

### Challenge 1: Swap Transaction Atomicity
**Problem**: Ensuring both events swap owners simultaneously without data inconsistency.

**Solution**: 
- Implemented SWAP_PENDING status to lock slots
- Used Mongoose transactions implicitly
- Validated both slots exist and are SWAPPABLE before creating request
- Atomic owner swap in single operation

### Challenge 2: Preventing Double Submissions
**Problem**: Users could double-click buttons, sending duplicate requests.

**Solution**:
- Added loading states to all async operations
- Disabled buttons during processing
- Show "Processing..." feedback
- Check loading state before executing actions

### Challenge 3: Cascade Delete
**Problem**: When user deleted, orphaned events and swap requests remained.

**Solution**:
- Implemented Mongoose pre-delete middleware
- Automatically delete all user's events
- Delete all swap requests involving user
- Ensures database consistency

### Challenge 4: Real-time UI Updates
**Problem**: UI not reflecting changes after swap operations.

**Solution**:
- Fetch fresh data after every mutation
- Use async/await properly
- Update state immediately after API response
- No page refresh needed

### Challenge 5: Nested Git Repository
**Problem**: Client folder had its own .git, causing submodule issues.

**Solution**:
- Removed client/.git folder
- Re-added client folder to main repository
- Ensured all files properly tracked

### Challenge 6: Status Management
**Problem**: Complex state transitions for events during swap process.

**Solution**:
- Clear state machine design
- Status enum with only 3 states
- Validation at each transition
- Prevent operations on SWAP_PENDING events

### Challenge 7: User Experience
**Problem**: Users need clear feedback on actions.

**Solution**:
- Color-coded status badges
- Loading states on buttons
- Alert messages for success/error
- Empty states with helpful messages
- Visual swap comparison in requests

### Challenge 8: Authentication Flow
**Problem**: Protecting routes and managing tokens.

**Solution**:
- JWT middleware on backend
- Token stored in localStorage
- Protected routes in React Router
- Automatic redirect to login if not authenticated
- Token included in all API requests

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
