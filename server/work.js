require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DEBUG_MODE = process.env.DEBUG_MODE || false;
process.env.TZSERVER = process.env.TZSERVER || 'America/Sao_Paulo';
// Test expression: https://cronjob.xyz/
process.env.TIME_SCHEDULER = process.env.TIME_SCHEDULER || '*/20 * * * *'; // default 20min

const mongoose = require('mongoose');

require('./models/logworker.model');
const workwes = require('./worker');

console.log('> Starting Work server...');

if (process.env.MONGO_DB) {
  mongoose.Promise = global.Promise;
  if (process.env.NODE_ENV !== 'production' && !!process.env.DEBUG_MODE) {
    mongoose.set('debug', true);
  }
  mongoose.set('useCreateIndex', true);
  mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }).then(async () => {
    console.log('WORK-Banco de dados conectado!');
    workwes.start();
  }).catch((err) => {
    console.log(`WORK-Erro conexão DB: ${err}`);
  });
}


console.log('> Started Work server!!!');
