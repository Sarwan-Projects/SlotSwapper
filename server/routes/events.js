const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all events for logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.userId }).sort({ startTime: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
});

// Create new event
router.post('/', [
  auth,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('startTime').isISO8601().withMessage('Valid start time is required'),
  body('endTime').isISO8601().withMessage('Valid end time is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, startTime, endTime, status } = req.body;

    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const event = new Event({
      title,
      startTime,
      endTime,
      status: status || 'BUSY',
      userId: req.userId
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error creating event' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, startTime, endTime, status } = req.body;
    
    const event = await Event.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status === 'SWAP_PENDING') {
      return res.status(400).json({ message: 'Cannot update event with pending swap' });
    }

    if (title) event.title = title;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (status) event.status = status;

    if (event.endTime <= event.startTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error updating event' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status === 'SWAP_PENDING') {
      return res.status(400).json({ message: 'Cannot delete event with pending swap' });
    }

    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
});

module.exports = router;
