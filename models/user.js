var MakeUp = require('../models/makeup.js');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
 name: String,
 userid: {type: String, unique: true, index:true, required: true},
 photocount: {type: Number, default: 0},
 date: {type: Date, default: Date.now}
}); 
module.exports = mongoose.model('User', userSchema); 
