const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendEscalationEmail } = require('./emailService');

const runEscalation = async () => {
  try {
    console.log('⏰ Escalation job running...', new Date().toLocaleString());

    // Find complaints past deadline and not resolved/closed
    const complaints = await Complaint.find({
      status: { $in: ['submitted', 'assigned', 'in-progress'] },
      deadline: { $lt: new Date() }
    }).populate('citizen', 'name email');

    console.log(`Found ${complaints.length} complaints to escalate`);

    for (const complaint of complaints) {
      // Update status to escalated
      complaint.status = 'escalated';
      complaint.escalationCount += 1;

      // Extend deadline by 24 more hours after escalation
      complaint.deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await complaint.save();

      // Send email to citizen
      if (complaint.citizen?.email) {
        await sendEscalationEmail(
          complaint.citizen.email,
          complaint.citizen.name,
          complaint.title
        );
      }

      console.log(`✅ Escalated: ${complaint.title}`);
    }

  } catch (error) {
    console.log('Escalation error:', error.message);
  }
};

module.exports = { runEscalation };