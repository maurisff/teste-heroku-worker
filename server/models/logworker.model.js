
const mongoose = require('mongoose');

const { Schema } = mongoose;

const SchemaTabela = new Schema({
  type: {
    type: String,
    required: 'type required',
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('LogWorker', SchemaTabela);
