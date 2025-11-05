const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../testApp');
const User = require('../models/User');
const Event = require('../models/Event');

describe('Events Tests', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/slotswapper-test');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Event.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Event.deleteMany({});

    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

    token = res.body.token;
    userId = res.body.user.id;
  });

  describe('POST /api/events', () => {
    it('should create a new event with valid data', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Meeting',
          startTime: new Date(Date.now() + 86400000).toISOString(),
          endTime: new Date(Date.now() + 90000000).toISOString(),
          status: 'BUSY'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', 'Test Meeting');
      expect(res.body).toHaveProperty('status', 'BUSY');
    });

    it('should not create event without authentication', async () => {
      const res = await request(app)
        .post('/api/events')
        .send({
          title: 'Test Meeting',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString()
        });

      expect(res.statusCode).toBe(401);
    });

    it('should not create event with end time before start time', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Meeting',
          startTime: new Date(Date.now() + 3600000).toISOString(),
          endTime: new Date().toISOString()
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/events', () => {
    beforeEach(async () => {
      await Event.create({
        title: 'Event 1',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        status: 'BUSY',
        userId
      });
    });

    it('should get all user events', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });

  describe('PUT /api/events/:id', () => {
    let eventId;

    beforeEach(async () => {
      const event = await Event.create({
        title: 'Event 1',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        status: 'BUSY',
        userId
      });
      eventId = event._id;
    });

    it('should update event status', async () => {
      const res = await request(app)
        .put(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'SWAPPABLE' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'SWAPPABLE');
    });

    it('should not update another user\'s event', async () => {
      const otherUser = await User.create({
        name: 'Other User',
        email: 'other@example.com',
        password: 'password123'
      });

      const otherEvent = await Event.create({
        title: 'Other Event',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        status: 'BUSY',
        userId: otherUser._id
      });

      const res = await request(app)
        .put(`/api/events/${otherEvent._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'SWAPPABLE' });

      expect(res.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/events/:id', () => {
    let eventId;

    beforeEach(async () => {
      const event = await Event.create({
        title: 'Event 1',
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        status: 'BUSY',
        userId
      });
      eventId = event._id;
    });

    it('should delete event', async () => {
      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      const deletedEvent = await Event.findById(eventId);
      expect(deletedEvent).toBeNull();
    });

    it('should not delete event with SWAP_PENDING status', async () => {
      await Event.findByIdAndUpdate(eventId, { status: 'SWAP_PENDING' });

      const res = await request(app)
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
    });
  });
});
