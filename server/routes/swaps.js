const express = require('express');
const Event = require('../models/Event');
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all swappable slots (excluding user's own)
router.get('/swappable-slots', auth, async (req, res) => {
  try {
    const events = await Event.find({
      status: 'SWAPPABLE',
      userId: { $ne: req.userId }
    })
    .populate('userId', 'name email')
    .sort({ startTime: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Get swappable slots error:', error);
    res.status(500).json({ message: 'Server error fetching swappable slots' });
  }
});

// Create swap request
router.post('/swap-request', auth, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    if (!mySlotId || !theirSlotId) {
      return res.status(400).json({ message: 'Both slot IDs are required' });
    }

    // Verify my slot
    const mySlot = await Event.findOne({ _id: mySlotId, userId: req.userId });
    if (!mySlot) {
      return res.status(404).json({ message: 'Your slot not found' });
    }
    if (mySlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Your slot must be swappable' });
    }

    // Verify their slot
    const theirSlot = await Event.findById(theirSlotId);
    if (!theirSlot) {
      return res.status(404).json({ message: 'Target slot not found' });
    }
    if (theirSlot.status !== 'SWAPPABLE') {
      return res.status(400).json({ message: 'Target slot must be swappable' });
    }
    if (theirSlot.userId.toString() === req.userId) {
      return res.status(400).json({ message: 'Cannot swap with your own slot' });
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      requesterId: req.userId,
      requesterSlotId: mySlotId,
      targetUserId: theirSlot.userId,
      targetSlotId: theirSlotId,
      status: 'PENDING'
    });

    await swapRequest.save();

    // Update both slots to SWAP_PENDING
    mySlot.status = 'SWAP_PENDING';
    theirSlot.status = 'SWAP_PENDING';
    await mySlot.save();
    await theirSlot.save();

    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requesterId', 'name email')
      .populate('requesterSlotId')
      .populate('targetUserId', 'name email')
      .populate('targetSlotId');

    // Send real-time notification to target user
    const io = req.app.get('io');
    const userSockets = req.app.get('userSockets');
    const targetSocketId = userSockets.get(theirSlot.userId.toString());
    
    if (targetSocketId) {
      io.to(targetSocketId).emit('newSwapRequest', {
        message: `${populatedRequest.requesterId.name} wants to swap with you!`,
        request: populatedRequest
      });
    }

    res.status(201).json(populatedRequest);
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ message: 'Server error creating swap request' });
  }
});

// Get incoming swap requests
router.get('/swap-requests/incoming', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      targetUserId: req.userId,
      status: 'PENDING'
    })
    .populate('requesterId', 'name email')
    .populate('requesterSlotId')
    .populate('targetSlotId')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ message: 'Server error fetching incoming requests' });
  }
});

// Get outgoing swap requests
router.get('/swap-requests/outgoing', auth, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      requesterId: req.userId,
      status: 'PENDING'
    })
    .populate('targetUserId', 'name email')
    .populate('requesterSlotId')
    .populate('targetSlotId')
    .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get outgoing requests error:', error);
    res.status(500).json({ message: 'Server error fetching outgoing requests' });
  }
});

// Respond to swap request
router.post('/swap-response/:requestId', auth, async (req, res) => {
  try {
    const { accept } = req.body;
    const { requestId } = req.params;

    const swapRequest = await SwapRequest.findById(requestId)
      .populate('requesterSlotId')
      .populate('targetSlotId')
      .populate('requesterId', 'name email')
      .populate('targetUserId', 'name email');

    if (!swapRequest) {
      return res.status(404).json({ message: 'Swap request not found' });
    }

    if (swapRequest.targetUserId._id.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    if (swapRequest.status !== 'PENDING') {
      return res.status(400).json({ message: 'Swap request already processed' });
    }

    const requesterSlot = swapRequest.requesterSlotId;
    const targetSlot = swapRequest.targetSlotId;
    const requesterId = swapRequest.requesterId._id.toString();

    if (accept) {
      // Accept: Swap the owners
      const tempUserId = requesterSlot.userId;
      requesterSlot.userId = targetSlot.userId;
      targetSlot.userId = tempUserId;

      requesterSlot.status = 'BUSY';
      targetSlot.status = 'BUSY';

      await requesterSlot.save();
      await targetSlot.save();

      swapRequest.status = 'ACCEPTED';
      
      // Send real-time notification to requester
      const io = req.app.get('io');
      const userSockets = req.app.get('userSockets');
      const requesterSocketId = userSockets.get(requesterId);
      
      if (requesterSocketId) {
        io.to(requesterSocketId).emit('swapAccepted', {
          message: `${swapRequest.targetUserId.name} accepted your swap request!`,
          request: swapRequest
        });
      }
    } else {
      // Reject: Reset slots to SWAPPABLE
      requesterSlot.status = 'SWAPPABLE';
      targetSlot.status = 'SWAPPABLE';

      await requesterSlot.save();
      await targetSlot.save();

      swapRequest.status = 'REJECTED';
      
      // Send real-time notification to requester
      const io = req.app.get('io');
      const userSockets = req.app.get('userSockets');
      const requesterSocketId = userSockets.get(requesterId);
      
      if (requesterSocketId) {
        io.to(requesterSocketId).emit('swapRejected', {
          message: `${swapRequest.targetUserId.name} rejected your swap request`,
          request: swapRequest
        });
      }
    }

    await swapRequest.save();

    const populatedRequest = await SwapRequest.findById(swapRequest._id)
      .populate('requesterId', 'name email')
      .populate('requesterSlotId')
      .populate('targetUserId', 'name email')
      .populate('targetSlotId');

    res.json(populatedRequest);
  } catch (error) {
    console.error('Swap response error:', error);
    res.status(500).json({ message: 'Server error processing swap response' });
  }
});

module.exports = router;
