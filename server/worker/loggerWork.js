
const axios = require('axios');

const { CronJob } = require('cron');
const moment = require('moment-timezone');
const repository = require('../repositories/logger.repository');

const tzLog = process.env.TZSERVER;


async function creatLogger() {
  try {
    try {
      const response = await axios.get('https://api.myip.com/');
      const { data } = response;
      const { cc, country, ip } = data;
      await repository.create({ type: 'INFO', message: `Created Loger on ${moment().tz(tzLog).format('DD/MM/YYYY HH:mm:ss')} of ${tzLog} - Country (${country}/${cc}) - IP: ${ip}` });
    } catch (error) {
      await repository.create({ type: 'ERROR', message: `Created Loger on ${moment().tz(tzLog).format('DD/MM/YYYY HH:mm:ss')} of ${tzLog}. Erro: ${error.message}` });
    }
  } catch (error) {
    console.error(`${moment().tz(tzLog).format('DD/MM/YYYY HH:mm:ss')} - Faled creatLogger. Erro: `, error);
    console.log('===================================================================================================================================');
  }
}


async function logger() {
  const cronTime = process.env.TIME_SCHEDULER;
  await creatLogger();
  // ================================================================================================================================
  const scheduller = new CronJob(cronTime, (() => {
    try {
      creatLogger();
    } catch (error) {
      console.error(`${moment().tz(tzLog).format()} - Execution logger. Error: `, error);
    }
  }), null, true, tzLog);
  scheduller.start();
  console.log('Started logger!');
}


module.exports = {
  async start() {
    console.log('starting someWorker...');
    await logger();
  },
};
