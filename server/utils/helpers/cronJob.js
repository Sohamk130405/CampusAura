// cronJob.js

const cron = require("node-cron");
const { deleteOldMessages } = require("../../controllers/messageController");

module.exports.cronJobs = () => {
  // Run the task every day at 1:00 AM
  cron.schedule("0 1 * * *", () => {
    deleteOldMessages();
  });
};
