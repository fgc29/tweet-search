var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose search model
module.exports = mongoose.model('Search', new Schema({
	text: String,
  date: { type: Date, default: Date.now }
}));
