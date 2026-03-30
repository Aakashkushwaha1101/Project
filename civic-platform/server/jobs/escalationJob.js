const cron = require('node-cron');
const { runEscalation } = require('../services/escalationService');

// Runs every hour
// Format: second minute hour day month weekday
const startEscalationJob = () => {
  cron.schedule('0 * * * *', async () => {
    await runEscalation();
  });

  console.log('⏰ Escalation cron job started');
};

module.exports = { startEscalationJob };