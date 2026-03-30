const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['road', 'water', 'electricity', 'sanitation', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['submitted', 'assigned', 'in-progress', 'escalated', 'resolved', 'closed'],
    default: 'submitted'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  location: {
    address: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number }
  },
  images: [{ type: String }],         // cloudinary image URLs
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  escalatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deadline: {
    type: Date,
    default: () => new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours from now
  },
  escalationCount: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);