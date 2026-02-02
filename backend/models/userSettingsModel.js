
import mongoose from 'mongoose';

const userSettingsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    unique: true,
  },
  revisionDays: {
    type: [Number], // Array of numbers 0-6 (Sunday - Saturday)
    default: [0, 1, 2, 3, 4, 5, 6],
  },
  preferredTime: {
    type: String, // Stored in 24hr format, e.g., "09:30"
    default: '09:00',
  },
  difficultyDistribution: {
    easy: { type: Number, default: 2, min: 0 },
    medium: { type: Number, default: 2, min: 0 },
    hard: { type: Number, default: 1, min: 0 },
  },
  problemsPerRevision: { // Calculated field
    type: Number,
    default: 5,
  },

  // --- CUSTOM REVISION FIELDS ---
  revisionMode: {
    type: String,
    enum: ['RANDOM', 'TOPIC', 'COMPANY', 'COMBO'],
    default: 'RANDOM',
  },
  customRevisionTopics: {
    type: [String],
    default: [],
  },
  customRevisionCompanies: {
    type: [String],
    default: [],
  },

  // --- NEW FIELD FOR PENDING SETTINGS ---
  pendingSettings: {
    type: {
      revisionDays: [Number],
      preferredTime: String,
      difficultyDistribution: {
        easy: Number,
        medium: Number,
        hard: Number
      },
      revisionMode: String,
      customRevisionTopics: [String],
      customRevisionCompanies: [String]
    },
    default: null
  }
}, {
  timestamps: true,
});

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
export default UserSettings;
