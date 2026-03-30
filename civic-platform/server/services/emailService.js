const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEscalationEmail = async (toEmail, citizenName, complaintTitle) => {
  try {
    await transporter.sendMail({
      from: `"Civic Platform" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: '⚠️ Your Complaint Has Been Escalated',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #e74c3c;">Complaint Escalated</h2>
          <p>Dear <strong>${citizenName}</strong>,</p>
          <p>Your complaint <strong>"${complaintTitle}"</strong> was not resolved within the deadline.</p>
          <p>It has been <strong>escalated to higher authorities</strong> for urgent action.</p>
          <br/>
          <p>— Civic Platform Team</p>
        </div>
      `
    });
    console.log(`Escalation email sent to ${toEmail}`);
  } catch (error) {
    console.log('Email error:', error.message);
  }
};

module.exports = { sendEscalationEmail };