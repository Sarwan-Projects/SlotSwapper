const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../testApp');
const User = require('../models/User');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');

describe('Swap Tests', () => {
  let token1, token2;
  let user1Id, user2Id;
  let event1Id, event2Id;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/slotswapper-test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Event.deleteMany({});
    await SwapRequest.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Event.deleteMany({});
    await SwapRequest.deleteMany({});

    // Create user 1
    const res1 = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'User 1',
        email: 'user1@example.com',
        password: 'password123'
      });
    token1 = res1.body.token;
    user1Id = res1.body.user.id;

    // Create user 2
    const res2 = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'password123'
      });
    token2 = res2.body.token;
    user2Id = res2.body.user.id;

    // Create swappable events
    const event1 = await Event.create({
      title: 'Event 1',
      startTime: new Date(Date.now() + 86400000),
      endTime: new Date(Date.now() + 90000000),
      status: 'SWAPPABLE',
      userId: user1Id
    });
    event1Id = event1._id;

    const event2 = await Event.create({
      title: 'Event 2',
      startTime: new Date(Date.now() + 172800000),
      endTime: new Date(Date.now() + 176400000),
      status: 'SWAPPABLE',
      userId: user2Id
    });
    event2Id = event2._id;
  });

  describe('GET /api/swappable-slots', () => {
    it('should get swappable slots excluding own slots', async () => {
      const res = await request(app)
        .get('/api/swappable-slots')
        .set('Authorization', `Bearer ${token1}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].userId.email).toBe('user2@example.com');
    });
  });

  describe('POST /api/swap-request', () => {
    it('should create swap request with valid slots', async () => {
      const res = await request(app)
        .post('/api/swap-request')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          mySlotId: event1Id,
          theirSlotId: event2Id
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('status', 'PENDING');

      // Check that both events are now SWAP_PENDING
      const event1 = await Event.findById(event1Id);
      const event2 = await Event.findById(event2Id);
      expect(event1.status).toBe('SWAP_PENDING');
      expect(event2.status).toBe('SWAP_PENDING');
    });

    it('should not create swap request with non-swappable slot', async () => {
      await Event.findByIdAndUpdate(event1Id, { status: 'BUSY' });

      const res = await request(app)
        .post('/api/swap-request')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          mySlotId: event1Id,
          theirSlotId: event2Id
        });

      expect(res.statusCode).toBe(400);
    });

    it('should not create swap request with own slot', async () => {
      const res = await request(app)
        .post('/api/swap-request')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          mySlotId: event1Id,
          theirSlotId: event1Id
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/swap-response/:requestId', () => {
    let swapRequestId;

    beforeEach(async () => {
      const swapRequest = await SwapRequest.create({
        requesterId: user1Id,
        requesterSlotId: event1Id,
        targetUserId: user2Id,
        targetSlotId: event2Id,
        status: 'PENDING'
      });
      swapRequestId = swapRequest._id;

      await Event.findByIdAndUpdate(event1Id, { status: 'SWAP_PENDING' });
      await Event.findByIdAndUpdate(event2Id, { status: 'SWAP_PENDING' });
    });

    it('should accept swap request and exchange owners', async () => {
      const res = await request(app)
        .post(`/api/swap-response/${swapRequestId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ accept: true });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ACCEPTED');

      // Check that owners were swapped
      const event1 = await Event.findById(event1Id);
      const event2 = await Event.findById(event2Id);
      
      expect(event1.userId.toString()).toBe(user2Id);
      expect(event2.userId.toString()).toBe(user1Id);
      expect(event1.status).toBe('BUSY');
      expect(event2.status).toBe('BUSY');
    });

    it('should reject swap request and reset slots', async () => {
      const res = await request(app)
        .post(`/api/swap-response/${swapRequestId}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ accept: false });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('REJECTED');

      // Check that slots are back to SWAPPABLE
      const event1 = await Event.findById(event1Id);
      const event2 = await Event.findById(event2Id);
      
      expect(event1.status).toBe('SWAPPABLE');
      expect(event2.status).toBe('SWAPPABLE');
    });

    it('should not allow non-target user to respond', async () => {
      const res = await request(app)
        .post(`/api/swap-response/${swapRequestId}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ accept: true });

      expect(res.statusCode).toBe(403);
    });
  });
});
