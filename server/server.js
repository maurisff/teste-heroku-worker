require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DEBUG_MODE = process.env.DEBUG_MODE || false;
process.env.TZSERVER = process.env.TZSERVER || 'America/Sao_Paulo';
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const moment = require('moment-timezone');
require('./models/logworker.model');
const repository = require('./repositories/logger.repository');

const app = express();

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
    console.log('API-Banco de dados conectado!');
  }).catch((err) => {
    console.log(`API-Erro conexão DB: ${err}`);
  });
}

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
// secure apps by setting various HTTP headers
app.use(helmet());
// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// use morgan to log requests to the console
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/api/', (req, res) => {
  res.status(200).json({ status: 'OK', dateTime: (process.env.TZSERVER ? moment.tz(process.env.TZSERVER).format() : moment.format()) });
});


app.get('/api/logger', async (req, res) => {
  try {
    let result = [];
    result = await repository.selectByFilter({}, req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ code: error.code, message: error.message });
  }
});

app.get('*', (req, res) => {
  res.status(400).json({
    message: 'API Not Found',
    method: req.originalMethod,
    endpoint: req.originalUrl,
  });
});

const port = process.env.PORT || process.env.API_PORT || 4000;

console.log('> Starting API server...');
app.listen(port, () => {
  console.log('API Server escutando a porta: ', port);
});
