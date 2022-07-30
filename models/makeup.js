// The Makeup model  
var Product = require('./product.js');
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var makeupSchema = new Schema({
    author: {type : Schema.ObjectId, ref : 'User'}, 
    instanceid: String,
    photoid: {type:String, required: false, index: true},
    name: {type:String, required: false},
    date: {type: Date, default: Date.now}, 
    products : []
});

module.exports = mongoose.model('MakeUp', makeupSchema);