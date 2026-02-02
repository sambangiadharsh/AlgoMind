import mongoose from 'mongoose';

const revisionProblemSchema = new mongoose.Schema({
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED'],
    default: 'PENDING',
  },
  confidence: {
    type: String,
    enum: ['FORGOT', 'LESS_CONFIDENT', 'MASTERED', null],
    default: null,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
});

const revisionSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Store date as start of day for consistent calendar tracking
    date: {
      type: Date,
      required: true,
    },
    problems: [revisionProblemSchema],
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only have one session per calendar day
revisionSessionSchema.index({ user: 1, date: 1 }, { unique: true });

// Pre-save middleware to normalize date to start of day
revisionSessionSchema.pre('save', function(next) {
  if (this.isModified('date') || this.isNew) {
    const normalizedDate = new Date(this.date);
    normalizedDate.setHours(0, 0, 0, 0);
    this.date = normalizedDate;
  }
  next();
});

// Static method to get today's session
revisionSessionSchema.statics.findTodaysSession = async function(userId) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  return this.findOne({ user: userId, date: todayStart }).populate('problems.problem');
};

// Static method to check if a problem is in today's revision
revisionSessionSchema.statics.isProblemInTodaysRevision = async function(userId, problemId) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const session = await this.findOne({ 
    user: userId, 
    date: todayStart,
    'problems.problem': problemId
  });
  
  return !!session;
};

const RevisionSession = mongoose.model('RevisionSession', revisionSessionSchema);

export default RevisionSession;