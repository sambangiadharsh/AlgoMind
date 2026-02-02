import mongoose from 'mongoose';

const problemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    link: {
      type: String,
      required: [true, 'Please add a link to the problem'],
    },
    difficulty: {
      type: String,
      required: [true, 'Please select a difficulty'],
      enum: ['Easy', 'Medium', 'Hard'],
    },
    tags: [{ type: String }],
    companyTags: [{ type: String }],
    notes: { type: String },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Mastered', 'Revisiting'],
    },
    lastRevised: {
      type: Date,
    },
    nextRevisionDate: {
      type: Date,
      default: Date.now,
    },
    revisionInterval: {
      type: Number, // The interval in days
      default: 1,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    // Track if problem is in today's revision session
    inTodaysRevision: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;