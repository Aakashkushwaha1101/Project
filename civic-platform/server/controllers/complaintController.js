const Complaint = require('../models/Complaint');

// Submit new complaint (citizen)
const submitComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      location,
      citizen: req.user.id
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all complaints (admin/official)
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('citizen', 'name email phone')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 });

    res.status(200).json({ complaints });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my complaints (citizen)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ citizen: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ complaints });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name email phone')
      .populate('assignedTo', 'name email department');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ complaint });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update complaint status (official/admin)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({
      message: 'Status updated successfully',
      complaint
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Assign complaint to official (admin)
const assignComplaint = async (req, res) => {
  try {
    const { officialId } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: officialId,
        status: 'assigned'
      },
      { new: true }
    ).populate('assignedTo', 'name email department');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({
      message: 'Complaint assigned successfully',
      complaint
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete complaint (admin only)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.status(200).json({ message: 'Complaint deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  updateComplaintStatus,
  assignComplaint,
  deleteComplaint
};