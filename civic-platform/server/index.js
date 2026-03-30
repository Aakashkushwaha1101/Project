const express = require('express');  //Web server framework
const mongoose = require('mongoose');  //Talk to MongoDB
const cors = require('cors');     //Allow frontend to talk to backend
const dotenv = require('dotenv');


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// TEMP TEST ROUTE - escalation manually trigger karo
app.get('/api/test-escalation', async (req, res) => {
  const { runEscalation } = require('./services/escalationService');
  await runEscalation();
  res.json({ message: 'Escalation job ran manually' });
});

// Test route
app.get('/', (req, res) => {
  res.send('Civic Platform API is running ✅');
});

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected ✅');

    // Start escalation cron job
    const { startEscalationJob } = require('./jobs/escalationJob');
    startEscalationJob();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} ✅`);
    });
  })
  .catch((err) => console.log('MongoDB error:', err));