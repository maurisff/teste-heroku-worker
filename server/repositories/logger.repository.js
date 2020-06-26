
const mongoose = require('mongoose');

const Model = mongoose.model('LogWorker');

exports.create = async (data) => new Model(data).save();

exports.selectByFilter = async (fields = null, filter = null) => Model.find((filter || {})).select((fields || {})).sort({ createdAt: -1 });
