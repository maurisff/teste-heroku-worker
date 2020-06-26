const loggerWork = require('./loggerWork');

module.exports = {
  async start() {
    console.log('Initializing background services...');
    await loggerWork.start();
  },
};
