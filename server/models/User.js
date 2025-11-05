const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Cascade delete: Remove all user's events and swap requests when user is deleted
userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    const Event = mongoose.model('Event');
    const SwapRequest = mongoose.model('SwapRequest');
    
    // Delete all events owned by this user
    await Event.deleteMany({ userId: this._id });
    
    // Delete all swap requests involving this user
    await SwapRequest.deleteMany({
      $or: [
        { requesterId: this._id },
        { targetUserId: this._id }
      ]
    });
    
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
