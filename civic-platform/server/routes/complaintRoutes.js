const express = require('express');
const router = express.Router();
const {
  submitComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  deleteComplaint
} = require('../controllers/complaintController');

const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Citizen routes
router.post('/', protect, authorizeRoles('citizen'), submitComplaint);
router.get('/my', protect, authorizeRoles('citizen'), getMyComplaints);

// Official + Admin routes
router.get('/', protect, authorizeRoles('official', 'admin'), getAllComplaints);
router.put('/:id/status', protect, authorizeRoles('official', 'admin'), updateComplaintStatus);

// Admin only routes
router.put('/:id/assign', protect, authorizeRoles('admin'), assignComplaint);
router.delete('/:id', protect, authorizeRoles('admin'), deleteComplaint);

// Any logged in user
router.get('/:id', protect, getComplaintById);

module.exports = router;